"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const okex_node_1 = require("@okfe/okex-node");
const Utils_1 = require("./Utils");
const ExpiredTimeout = 30000;
const MaxPendingCount = 1000;
const MaxErrorCount = 10;
const DEPTH_TABLE = "spot/depth";
const ORDER_TABLE = "spot/order";
const DEPTH_PREFIX = DEPTH_TABLE + ":";
const ORDER_PREFIX = ORDER_TABLE + ":";
class DepthMonitor {
    constructor(httpKey, httpSecret, passphrase) {
        this.httpKey = httpKey;
        this.httpSecret = httpSecret;
        this.passphrase = passphrase;
        this._isLogined = false;
        this._isInitializedDataFlag = false;
        this.authClient = okex_node_1.AuthenticatedClient(this.httpKey, this.httpSecret, this.passphrase);
        this._subscribeEvents = [];
        this._pendingSubscribeEvents = [];
        this._subscribeInstrumentId = "";
        this._pendingOrders = new Map();
        this._bids = [];
        this._asks = [];
    }
    compareAccount(account) {
        const selfAccount = {
            httpkey: this.httpKey,
            httpsecret: this.httpSecret,
            passphrase: this.passphrase
        };
        console.log("args: ", account);
        console.log("selfArgs: ", selfAccount);
        return (this.httpKey == account.httpkey
            && this.httpSecret === account.httpsecret
            && this.passphrase === account.passphrase);
    }
    _checkOkexConnection() {
        if (this.connection === undefined) {
            this.connection = new okex_node_1.V3WebsocketClient();
            this.connection.on("open", () => this.onOkexConnectionOpened());
            this.connection.on("close", () => this.onOkexConnectionClosed());
            this.connection.on("message", (data) => this.onOkexConnectionMessage(data));
            this.connection.connect();
            this._startExpiredTimer();
        }
        return this.connection;
    }
    _login() {
        const connection = this._checkOkexConnection();
        if (!this._isLogined) {
            connection.login(this.httpKey, this.httpSecret, this.passphrase);
        }
    }
    _startExpiredTimer() {
        this._stopExpiredTimer();
        this._expiredTimeoutHandler = setTimeout(() => {
            console.log("[DepthMonitor] ExpiredTimeout happened");
            this._expiredTimeoutHandler = undefined;
            if (this.connection) {
                const holdOkexConnection = this.connection;
                this.connection = undefined;
                return holdOkexConnection.close();
            }
            this._checkOkexConnection();
        }, ExpiredTimeout);
    }
    _stopExpiredTimer() {
        if (this._expiredTimeoutHandler !== undefined) {
            clearTimeout(this._expiredTimeoutHandler);
            this._expiredTimeoutHandler = undefined;
        }
    }
    monit(instrument_id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("monit:");
            console.log("\tsubscribedInstrumentId:", this._subscribeInstrumentId);
            console.log("\tinstrument_id:", instrument_id);
            this._checkOkexConnection();
            const result = DEPTH_PREFIX + instrument_id.toUpperCase();
            if (this._subscribeInstrumentId !== instrument_id) {
                try {
                    yield this._uninitializeSubscribes();
                    yield this._uninitializeData();
                    this._subscribeInstrumentId = instrument_id;
                    yield this._initializeData();
                    yield this._initializeSubscribes();
                    this._monitEventName = result;
                }
                catch (error) {
                    this._subscribeInstrumentId = "";
                    this._monitEventName = undefined;
                    throw error;
                }
            }
            return result;
        });
    }
    unmonit(instrument_id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("unmonit:");
            console.log("\tsubscribedInstrumentId:", this._subscribeInstrumentId);
            console.log("\tinstrument_id:", instrument_id);
            this._checkOkexConnection();
            const result = DEPTH_PREFIX + instrument_id.toUpperCase();
            if (this._subscribeInstrumentId === instrument_id) {
                yield this._uninitializeSubscribes();
                yield this._uninitializeData();
                this._monitEventName = undefined;
                this._subscribeInstrumentId = "";
            }
            return result;
        });
    }
    _initializeData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isInitializedDataFlag) {
                return;
            }
            this._isInitializedDataFlag = true;
            this._pendingOrders.clear();
            let from = undefined;
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
                        const resp = yield this.authClient.spot().getOrdersPending(pendingParams);
                        resp.forEach(elem => {
                            this._pendingOrders.set(elem.order_id, elem);
                        });
                        if (resp.length > 0) {
                            from = resp[resp.length - 1].order_id;
                        }
                        continuedErrorHappened = 0;
                        // TODO
                        yield Utils_1.delay(100);
                        if (resp.length < MaxPendingCount) {
                            break;
                        }
                    }
                    catch (error) {
                        continuedErrorHappened++;
                        if (continuedErrorHappened >= MaxErrorCount) {
                            throw error;
                        }
                        yield Utils_1.delay(100);
                        console.log("[DepthMonitor] getOrdersPending exception:", error.toString());
                    }
                }
            }
            catch (error) {
                this._isInitializedDataFlag = false;
                throw error;
            }
            this._isInitializedDataFlag = false;
            console.log("getPendingOrders[" + this._subscribeInstrumentId + "]:", this._pendingOrders.size);
        });
    }
    _initializeSubscribes() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = this._checkOkexConnection();
            const subscribeOrderEvent = ORDER_PREFIX + this._subscribeInstrumentId.toUpperCase();
            const subscribeDepthEvent = DEPTH_PREFIX + this._subscribeInstrumentId.toUpperCase();
            if (this._isLogined) {
                try {
                    connection.subscribe(subscribeOrderEvent);
                    connection.subscribe(subscribeDepthEvent);
                    this._subscribeEvents.push(subscribeOrderEvent);
                    this._subscribeEvents.push(subscribeDepthEvent);
                }
                catch (error) {
                    this._pendingSubscribeEvents.push(subscribeOrderEvent);
                    this._pendingSubscribeEvents.push(subscribeDepthEvent);
                    this.onOkexConnectionClosed();
                }
            }
            else {
                this._pendingSubscribeEvents.push(subscribeOrderEvent);
                this._pendingSubscribeEvents.push(subscribeDepthEvent);
            }
        });
    }
    _uninitializeData() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO
            this._pendingOrders = new Map();
        });
    }
    _uninitializeSubscribes() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = this._checkOkexConnection();
            console.log("_uninitializeSubscribes:", connection.toString(), this._isLogined, this._subscribeEvents);
            if (this._isLogined) {
                this._subscribeEvents.forEach(subscribeEventName => {
                    connection.unsubscribe(subscribeEventName);
                });
                // TODO
                this._subscribeEvents = [];
            }
        });
    }
    onOkexConnectionOpened() {
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
    onOkexConnectionClosed() {
        console.log("[DepthMonitor] okexConnection closed");
        this.connection = undefined;
        this._isLogined = false;
        this._pendingOrders = new Map();
        this._pendingSubscribeEvents = [];
        this._subscribeEvents.forEach(value => this._pendingSubscribeEvents.push(value));
        this._subscribeEvents = [];
        this._stopExpiredTimer();
        this._checkOkexConnection();
    }
    onOkexConnectionLogined() {
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
    onOkexConnectionMessage(data) {
        // console.log("[OkexMonitProxy] okexConnection message recieved:", typeof data, data);
        try {
            const jsonData = JSON.parse(data);
            if (jsonData.event && typeof jsonData.event === "string") {
                if (jsonData.event === "login") {
                    this.onOkexConnectionLogined();
                }
                else if (jsonData.event === "error") {
                    console.log("[DepthMonitor] okexConnection error:", jsonData.errorCode, jsonData.message);
                }
                else {
                    console.log("[DepthMonitor] okexConnection message:", jsonData.event, jsonData.channel);
                }
            }
            else if (jsonData.table && typeof jsonData.table === "string") {
                if (jsonData.table === ORDER_TABLE) {
                    // TODO: order handler
                    this._onOrderEvent(jsonData);
                }
                else if (jsonData.table === DEPTH_TABLE) {
                    // TODO: depth handler
                    this._onDepthEvent(jsonData);
                }
                else {
                    console.log("[DepthMonitor] onOkexConnectionMessage unexcepted table:", jsonData.table);
                }
            }
            else {
                console.log("[DepthMonitor] onOkexConnectionMessage unhandle:", data);
            }
        }
        catch (error) {
            console.log("[DepthMonitor] exception:", error);
        }
        // TODO: flag checked
        if (!this._isLogined) {
            this._login();
        }
    }
    _onOrderEvent(jsonData) {
        console.log("[DepthMonitor] _onOrderEvent:", jsonData);
        if (!jsonData.data && !Array.isArray(jsonData.data)) {
            console.log("[DepthMonitor] _onOrderEvent unexcepted format with data property:", typeof jsonData.data);
            return;
        }
        const orderDatas = jsonData.data;
        orderDatas.forEach(order => {
            const orderStatus = order.status;
            if (this._pendingOrders.has(order.order_id)) {
                if (orderStatus === -2 /* kFailure */
                    || orderStatus === 2 /* kFinalTransaction */
                    || orderStatus === -1 /* kWithdrawalSuccess */) {
                    this._pendingOrders.delete(order.order_id);
                }
                else if (orderStatus === 0 /* kWaittingTransaction */
                    || orderStatus === 1 /* kPartialTransaction */) {
                    this._pendingOrders.set(order.order_id, order);
                }
            }
        });
    }
    _onDepthEvent(jsonData) {
        // console.log("[DepthMonitor] _onDepthEvent:", jsonData.action, JSON.stringify(jsonData.data));
        if (!jsonData.action
            || typeof jsonData.action !== "string"
            || !jsonData.data
            || !Array.isArray(jsonData.data)) {
            console.log("[DepthMonitor] _onDepthEvent unexcepted format.");
            return;
        }
        if (jsonData.action === "partial" /* kPartial */) {
            this._bids = jsonData.data[0].bids;
            this._asks = jsonData.data[0].asks;
        }
        else {
            // action is update
            DepthMonitor._updateDepthData(jsonData.data[0].bids, this._bids, (a, b) => a[0] <= b[0]);
            DepthMonitor._updateDepthData(jsonData.data[0].asks, this._asks, (a, b) => a[0] >= b[0]);
        }
        // TODO: send notification
        const depthInfo = this._calcDepthInfo();
        // Facade.getInstance().sendNotification(this._monitEventName, depthInfo);
    }
    _calcDepthInfo() {
        const orderPrices = new Map();
        for (const key in this._pendingOrders) {
            const item = this._pendingOrders[key];
            if (orderPrices.has(item.price)) {
                const holdSize = orderPrices.get(item.price);
                orderPrices.set(item.price, holdSize + (Number(item.size) - Number(item.filled_size)));
            }
            else {
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
    static _updateDepthData(src, dist, compare) {
        src.forEach(aItem => {
            const foundIndex = dist.findIndex(value => {
                return compare(aItem, value);
            });
            if (foundIndex >= 0) {
                if (aItem[0] === dist[foundIndex][0]) {
                    if (aItem[1] === "0") {
                        dist.splice(foundIndex, 1);
                    }
                    else {
                        dist[foundIndex] = aItem;
                    }
                }
                else {
                    dist.splice(foundIndex, 0, aItem);
                }
            }
            else {
                dist.push(aItem);
            }
        });
    }
    static _combinaPendingOrder(pendingData, dist) {
        dist.forEach(elem => {
            if (pendingData.has(elem[0])) {
                const holdSize = pendingData.get(elem[0]);
                elem.push(holdSize);
            }
        });
    }
}
exports.default = DepthMonitor;
