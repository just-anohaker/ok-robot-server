import { V3WebsocketClient, AuthenticatedClient } from "@okfe/okex-node";
import Facade from "../../../../patterns/facade/Facade";
import { OKexAccount } from "../../../Types";
import { delay } from "./Utils";

const ExpiredTimeout = 30000;
const MaxPendingCount = 1000;
const MaxErrorCount = 10;
const DEPTH_TABLE = "spot/depth";
const ORDER_TABLE = "spot/order";
const DEPTH_PREFIX = DEPTH_TABLE + ":";
const ORDER_PREFIX = ORDER_TABLE + ":";

const enum OrderStatus {
    kFailure = -2,
    kWithdrawalSuccess = -1,
    kWaittingTransaction = 0,
    kPartialTransaction = 1,
    kFinalTransaction = 2,
    kTransactioning = 3,
    kWithdrawaling = 4
}

const enum DepthAction {
    kPartial = "partial",
    kUpdate = "update"
}

type DepthDataFormat = [string, string, string];
type DepthItemFormat = [string, string, string, number]

interface DepthInfo {
    bids: DepthItemFormat[],
    asks: DepthItemFormat[]
}

class DepthMonitor {
    private connection?: V3WebsocketClient;
    private authClient: any;
    private _expiredTimeoutHandler?: NodeJS.Timeout;
    private _isLogined = false;
    private _isValidable: boolean = true;

    private _isInitializedDataFlag = false;
    private _subscribeEvents: string[];
    private _pendingSubscribeEvents: string[];
    private _subscribeInstrumentId: string;
    private _monitEventName?: string;
    private _pendingOrders: Map<string, any>;
    private _bids: any[];
    private _asks: any[];

    constructor(private httpKey: string, private httpSecret: string, private passphrase: string) {
        this.authClient = AuthenticatedClient(this.httpKey, this.httpSecret, this.passphrase);
        this._subscribeEvents = [];
        this._pendingSubscribeEvents = [];
        this._subscribeInstrumentId = "";
        this._pendingOrders = new Map<string, any>();

        this._bids = [];
        this._asks = [];
    }

    compareAccount(account: OKexAccount): boolean {
        return (this.httpKey == account.httpkey
            && this.httpSecret === account.httpsecret
            && this.passphrase === account.passphrase);
    }

    private _checkOkexConnection(): V3WebsocketClient {
        if (this._isValidable && this.connection === undefined) {
            this.connection = new V3WebsocketClient();

            this.connection.on("open",
                () => this.onOkexConnectionOpened());
            this.connection.on("close",
                () => this.onOkexConnectionClosed());
            this.connection.on("message",
                (data: any) => this.onOkexConnectionMessage(data));

            this.connection.connect();
            this._startExpiredTimer();
        }
        return this.connection;
    }

    private _login() {
        const connection = this._checkOkexConnection();
        if (connection && !this._isLogined) {
            connection.login(this.httpKey, this.httpSecret, this.passphrase);
        }
    }

    private _startExpiredTimer(): void {
        this._stopExpiredTimer();

        this._expiredTimeoutHandler = setTimeout(() => {
            console.log("[DepthMonitor] ExpiredTimeout happened");
            this._expiredTimeoutHandler = undefined;
            if (this.connection) {
                const holdOkexConnection = this.connection;
                this.connection = undefined;
                holdOkexConnection.removeAllListeners("open");
                holdOkexConnection.removeAllListeners("close");
                holdOkexConnection.removeAllListeners("message");
                holdOkexConnection.close();
            }
            this._checkOkexConnection();
        }, ExpiredTimeout);
    }

    private _stopExpiredTimer(): void {
        if (this._expiredTimeoutHandler !== undefined) {
            clearTimeout(this._expiredTimeoutHandler);
            this._expiredTimeoutHandler = undefined;
        }
    }

    async monit(instrument_id: string): Promise<string> {
        console.log("monit:")
        console.log("\tsubscribedInstrumentId:", this._subscribeInstrumentId);
        console.log("\tinstrument_id:", instrument_id);
        this._checkOkexConnection();
        const result = DEPTH_PREFIX + instrument_id.toUpperCase();
        if (this._subscribeInstrumentId !== instrument_id) {
            try {
                await this._uninitializeSubscribes();
                await this._uninitializeData();

                this._subscribeInstrumentId = instrument_id;
                await this._initializeData();
                await this._initializeSubscribes();

                this._monitEventName = result;
            } catch (error) {
                this._subscribeInstrumentId = "";
                this._monitEventName = undefined;
                throw error;
            }
        }

        return result;
    }

    async unmonit(instrument_id: string): Promise<string> {
        console.log("unmonit:");
        console.log("\tsubscribedInstrumentId:", this._subscribeInstrumentId);
        console.log("\tinstrument_id:", instrument_id);
        this._checkOkexConnection();
        const result = DEPTH_PREFIX + instrument_id.toUpperCase();
        if (this._subscribeInstrumentId === instrument_id) {
            await this._uninitializeSubscribes();
            await this._uninitializeData();

            this._monitEventName = undefined;
            this._subscribeInstrumentId = "";
        }
        return result;
    }

    async _initializeData() {
        if (this._isInitializedDataFlag) {
            return;
        }
        this._isInitializedDataFlag = true;
        this._pendingOrders.clear();
        let from: string = undefined;
        let continuedErrorHappened = 0;
        try {
            while (true) {
                try {
                    const pendingParams = {
                        instrument_id: this._subscribeInstrumentId,
                        from: undefined,
                    };
                    if (from !== undefined) {
                        pendingParams.from = from;
                    }
                    const resp = await this.authClient.spot().getOrdersPending(pendingParams);
                    resp.forEach(elem => {
                        this._pendingOrders.set(elem.order_id, elem);
                    });
                    if (resp.length > 0) {
                        from = resp[resp.length - 1].order_id;
                    }
                    continuedErrorHappened = 0;

                    // TODO
                    await delay(100);
                    if (resp.length < MaxPendingCount) {
                        break;
                    }
                } catch (error) {
                    continuedErrorHappened++;
                    if (continuedErrorHappened >= MaxErrorCount) {
                        throw error;
                    }
                    await delay(100);
                    console.log("[DepthMonitor] getOrdersPending exception:", error.toString());
                }
            }
        } catch (error) {
            this._isInitializedDataFlag = false;
            throw error;
        }
        this._isInitializedDataFlag = false;
        console.log("getPendingOrders[" + this._subscribeInstrumentId + "]:", this._pendingOrders.size);
    }

    async _initializeSubscribes() {
        const connection = this._checkOkexConnection();
        const subscribeOrderEvent = ORDER_PREFIX + this._subscribeInstrumentId.toUpperCase();
        const subscribeDepthEvent = DEPTH_PREFIX + this._subscribeInstrumentId.toUpperCase();
        if (connection) {
            if (this._isLogined) {
                try {
                    connection.subscribe(subscribeOrderEvent);
                    connection.subscribe(subscribeDepthEvent);
                    this._subscribeEvents.push(subscribeOrderEvent);
                    this._subscribeEvents.push(subscribeDepthEvent);
                } catch (error) {
                    this._pendingSubscribeEvents.push(subscribeOrderEvent);
                    this._pendingSubscribeEvents.push(subscribeDepthEvent);
                    this.onOkexConnectionClosed();
                }
            } else {
                this._pendingSubscribeEvents.push(subscribeOrderEvent);
                this._pendingSubscribeEvents.push(subscribeDepthEvent);
            }
        }
    }

    async _uninitializeData() {
        // TODO
        this._pendingOrders = new Map<string, any>();
    }

    async _uninitializeSubscribes() {
        const connection = this._checkOkexConnection();
        console.log("_uninitializeSubscribes:", connection.toString(), this._isLogined, this._subscribeEvents);
        if (connection) {
            if (this._isLogined) {
                this._subscribeEvents.forEach(subscribeEventName => {
                    connection.unsubscribe(subscribeEventName);
                });
                // TODO
                this._subscribeEvents = [];
            }
        }
    }

    private onOkexConnectionOpened() {
        console.log("[DepthMonitor] okexConnection opened");
        this._stopExpiredTimer();
        if (!this._isLogined) {
            this._login();
        }
        // this._registerChannels.forEach((value, key) => {
        //     if (value === true) {
        //         this._okexConnection.subscribe(key);
        //     }
        // });
    }

    private onOkexConnectionClosed() {
        console.log("[DepthMonitor] okexConnection closed");
        this.connection = undefined;
        this._isLogined = false;
        this._pendingOrders = new Map<string, any>();
        this._pendingSubscribeEvents = [];
        this._subscribeEvents.forEach(value => this._pendingSubscribeEvents.push(value));
        this._subscribeEvents = [];
        this._stopExpiredTimer();
        this._checkOkexConnection();
    }

    private onOkexConnectionLogined() {
        console.log("[DepthMonitor] okexConnection logined");
        this._isLogined = true;

        if (this._subscribeInstrumentId !== "") {
            this._initializeData();
        }
        // this._initializeSubscribes();
        const connection = this._checkOkexConnection();
        this._pendingSubscribeEvents.forEach(eventName => {
            console.log("[DepthMonitor] okexConnection subscribe pending:", eventName);
            connection.subscribe(eventName);
            this._subscribeEvents.push(eventName);
        });
        this._pendingSubscribeEvents = [];
    }

    private onOkexConnectionMessage(data: any) {
        // console.log("[OkexMonitProxy] okexConnection message recieved:", typeof data, data);
        try {
            const jsonData = JSON.parse(data);
            if (jsonData.event && typeof jsonData.event === "string") {
                if (jsonData.event === "login") {
                    this.onOkexConnectionLogined();
                } else if (jsonData.event === "error") {
                    console.log("[DepthMonitor] okexConnection error:", jsonData.errorCode, jsonData.message);
                    this._isValidable = false;
                } else {
                    console.log("[DepthMonitor] okexConnection message:", jsonData.event, jsonData.channel);
                }
            } else if (jsonData.table && typeof jsonData.table === "string") {
                if (jsonData.table === ORDER_TABLE) {
                    // TODO: order handler
                    this._onOrderEvent(jsonData);
                } else if (jsonData.table === DEPTH_TABLE) {
                    // TODO: depth handler
                    this._onDepthEvent(jsonData);
                } else {
                    console.log("[DepthMonitor] onOkexConnectionMessage unexcepted table:", jsonData.table);
                }
            } else {
                console.log("[DepthMonitor] onOkexConnectionMessage unhandle:", data);
            }
        } catch (error) {
            console.log("[DepthMonitor] exception:", error);
        }

        // TODO: flag checked
        if (!this._isLogined) {
            this._login();
        }
    }

    private _onOrderEvent(jsonData: any) {
        console.log("[DepthMonitor] _onOrderEvent:", jsonData);
        if (!jsonData.data && !Array.isArray(jsonData.data)) {
            console.log("[DepthMonitor] _onOrderEvent unexcepted format with data property:", typeof jsonData.data);
            return;
        }
        const orderDatas = jsonData.data;
        orderDatas.forEach(order => {
            const orderStatus = order.status;
            if (this._pendingOrders.has(order.order_id)) {
                if (orderStatus === OrderStatus.kFailure
                    || orderStatus === OrderStatus.kFinalTransaction
                    || orderStatus === OrderStatus.kWithdrawalSuccess) {
                    this._pendingOrders.delete(order.order_id);
                } else if (orderStatus === OrderStatus.kWaittingTransaction
                    || orderStatus === OrderStatus.kPartialTransaction) {
                    this._pendingOrders.set(order.order_id, order);
                }
            }
        });
    }

    private _onDepthEvent(jsonData: any) {
        // console.log("[DepthMonitor] _onDepthEvent:", jsonData.action, JSON.stringify(jsonData.data));
        if (!jsonData.action
            || typeof jsonData.action !== "string"
            || !jsonData.data
            || !Array.isArray(jsonData.data)) {
            console.log("[DepthMonitor] _onDepthEvent unexcepted format.");
            return;
        }

        if (jsonData.action === DepthAction.kPartial) {
            this._bids = jsonData.data[0].bids;
            this._asks = jsonData.data[0].asks;
        } else {
            // action is update
            DepthMonitor._updateDepthData(
                jsonData.data[0].bids,
                this._bids,
                (a: DepthDataFormat, b: DepthDataFormat) => a[0] <= b[0]
            );
            DepthMonitor._updateDepthData(
                jsonData.data[0].asks,
                this._asks,
                (a: DepthDataFormat, b: DepthDataFormat) => a[0] >= b[0]
            );
        }

        // TODO: send notification
        const depthInfo = this._calcDepthInfo();
        Facade.getInstance().sendNotification(this._monitEventName, depthInfo);
    }

    private _calcDepthInfo(): DepthInfo {
        const orderPrices: Map<string, number> = new Map<string, number>();
        for (const key in this._pendingOrders) {
            const item = this._pendingOrders[key];
            if (orderPrices.has(item.price)) {
                const holdSize = orderPrices.get(item.price);
                orderPrices.set(item.price, holdSize + (Number(item.size) - Number(item.filled_size)));
            } else {
                orderPrices.set(item.price, Number(item.size) - Number(item.filled_size));
            }
        }

        const holdAsks = this._asks.slice();
        const holdBids = this._bids.slice();
        DepthMonitor._combinaPendingOrder(orderPrices, holdAsks);
        DepthMonitor._combinaPendingOrder(orderPrices, holdBids);

        return {
            asks: holdAsks,
            bids: holdBids
        };
    }

    private static _updateDepthData(src: DepthDataFormat[], dist: DepthDataFormat[],
        compare: (a: DepthDataFormat, b: DepthDataFormat) => boolean) {
        src.forEach(aItem => {
            const foundIndex = dist.findIndex(value => {
                return compare(aItem, value);
            });

            if (foundIndex >= 0) {
                if (aItem[0] === dist[foundIndex][0]) {
                    if (aItem[1] === "0") {
                        dist.splice(foundIndex, 1);
                    } else {
                        dist[foundIndex] = aItem;
                    }
                } else {
                    dist.splice(foundIndex, 0, aItem);
                }
            } else {
                dist.push(aItem);
            }
        });
    }

    private static _combinaPendingOrder(pendingData: Map<string, number>, dist: DepthItemFormat[]) {
        dist.forEach(elem => {
            if (pendingData.has(elem[0])) {
                const holdSize = pendingData.get(elem[0]);
                elem.push(holdSize);
            }
        })
    }
}

export default DepthMonitor;