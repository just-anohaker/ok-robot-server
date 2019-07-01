import { V3WebsocketClient } from "@okfe/okex-node";
import Facade from "../../../../patterns/facade/Facade";
import { OKexAccount } from "../../../Types";

const ExpiredTimeout = 30000;

class WalletMonitor {
    private connection?: V3WebsocketClient;
    private _expiredTimeoutHandler?: NodeJS.Timeout;
    private _isLogined: boolean = false;
    private _isValidable: boolean = true;

    private _subscribeEvents: string[] = [];
    private _pendingSubscribeEvents: string[] = [];

    constructor(private httpKey: string, private httpSecret: string, private passphrase: string) {

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
            console.log("[WalletMonitor] ExpiredTimeout happened");
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

    async monit(currency: string): Promise<string> {
        console.log("monit:")
        const connection = this._checkOkexConnection();
        const subscribeEvent = "spot/account:" + currency;
        if (connection) {
            if (this._subscribeEvents.includes(subscribeEvent) ||
                this._pendingSubscribeEvents.includes(subscribeEvent)) {
                return subscribeEvent;
            }

            if (this._isLogined) {
                try {
                    connection.subscribe(subscribeEvent);
                    this._subscribeEvents.push(subscribeEvent)
                } catch (error) {
                    this._pendingSubscribeEvents.push(subscribeEvent);
                    this.onOkexConnectionClosed();
                }
            } else {
                this._pendingSubscribeEvents.push(subscribeEvent);
            }
        }

        return subscribeEvent;
    }

    async unmonit(currency: string): Promise<string> {
        console.log("unmonit:");
        const connection = this._checkOkexConnection();
        const subscribeEvent = "spot/account:" + currency;
        if (connection) {
            if (this._subscribeEvents.includes(subscribeEvent)) {
                if (this._isLogined) {
                    connection.unsubscribe(subscribeEvent);
                }
                this._subscribeEvents.splice(this._subscribeEvents.findIndex(value => value === subscribeEvent), 1);
            } else if (this._pendingSubscribeEvents.includes(subscribeEvent)) {
                this._pendingSubscribeEvents.splice(this._pendingSubscribeEvents.findIndex(value => value === subscribeEvent), 1);
            }
        }

        return subscribeEvent;
    }

    private onOkexConnectionOpened() {
        console.log("[WalletMonitor] okexConnection opened");
        this._stopExpiredTimer();
        if (!this._isLogined) {
            this._login();
        }
    }

    private onOkexConnectionClosed() {
        console.log("[WalletMonitor] okexConnection closed");
        this.connection = undefined;
        this._isLogined = false;
        this._stopExpiredTimer();
        this._checkOkexConnection();
        for (let subscribeEvent of this._subscribeEvents) {
            this._pendingSubscribeEvents.push(subscribeEvent);
        }
        this._subscribeEvents = [];
    }

    private onOkexConnectionLogined() {
        console.log("[WalletMonitor] okexConnection logined");
        this._isLogined = true;

        // this._initializeSubscribes();
        const connection = this._checkOkexConnection();
        if (connection) {
            this._pendingSubscribeEvents.forEach(eventName => {
                console.log("[WalletMonitor] okexConnection subscribe pending:", eventName);
                connection.subscribe(eventName);
                this._subscribeEvents.push(eventName);
            });
            this._pendingSubscribeEvents = [];
        }
    }

    private onOkexConnectionMessage(data: any) {
        // console.log("[OkexMonitProxy] okexConnection message recieved:", typeof data, data);
        try {
            const jsonData = JSON.parse(data);
            if (jsonData.event && typeof jsonData.event === "string") {
                if (jsonData.event === "login") {
                    this.onOkexConnectionLogined();
                } else if (jsonData.event === "error") {
                    console.log("[WalletMonitor] okexConnection error:", jsonData.errorCode, jsonData.message);
                    this._isValidable = false;
                } else {
                    console.log("[WalletMonitor] okexConnection message:", jsonData.event, jsonData.channel);
                }
            } else if (jsonData.table && typeof jsonData.table === "string") {
                if (jsonData.table === "spot/account") {
                    // console.log("[WalletMonitor] acceptd spot/account:", JSON.stringify(jsonData.data));
                    const filter = new Map<string, any[]>();
                    for (let wallet of jsonData.data) {
                        let holdWallet: any[] = [];
                        if (filter.has(wallet.currency)) {
                            holdWallet = filter.get(wallet.currency);
                        }
                        holdWallet.push(wallet);
                        filter.set(wallet.currency, holdWallet);
                    }

                    for (let currency of filter.keys()) {
                        const notificationName = "spot/account:" + currency;
                        // console.log("[WalletMonitor] sendNotification:", JSON.stringify({ event: notificationName, data: filter.get(currency) }));
                        Facade.getInstance().sendNotification(notificationName, filter.get(currency));
                    }
                }
            } else {
                console.log("[WalletMonitor] onOkexConnectionMessage unhandle:", data);
            }
        } catch (error) {
            console.log("[WalletMonitor] exception:", error);
        }

        // // TODO: flag checked
        // if (!this._isLogined) {
        //     this._login();
        // }
    }
}

export default WalletMonitor;