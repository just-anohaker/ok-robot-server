"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const okex_node_1 = require("@okfe/okex-node");
const Facade_1 = __importDefault(require("../../../../patterns/facade/Facade"));
const ExpiredTimeout = 30000;
class WalletMonitor {
    constructor(httpKey, httpSecret, passphrase) {
        this.httpKey = httpKey;
        this.httpSecret = httpSecret;
        this.passphrase = passphrase;
        this._isLogined = false;
        this._subscribeEvents = [];
        this._pendingSubscribeEvents = [];
    }
    compareAccount(account) {
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
    _stopExpiredTimer() {
        if (this._expiredTimeoutHandler !== undefined) {
            clearTimeout(this._expiredTimeoutHandler);
            this._expiredTimeoutHandler = undefined;
        }
    }
    monit(currency) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("monit:");
            const connection = this._checkOkexConnection();
            const subscribeEvent = "spot/account:" + currency;
            if (this._subscribeEvents.includes(subscribeEvent) ||
                this._pendingSubscribeEvents.includes(subscribeEvent)) {
                return subscribeEvent;
            }
            if (this._isLogined) {
                try {
                    connection.subscribe(subscribeEvent);
                    this._subscribeEvents.push(subscribeEvent);
                }
                catch (error) {
                    this._pendingSubscribeEvents.push(subscribeEvent);
                    this.onOkexConnectionClosed();
                }
            }
            else {
                this._pendingSubscribeEvents.push(subscribeEvent);
            }
            return subscribeEvent;
        });
    }
    unmonit(currency) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("unmonit:");
            const connection = this._checkOkexConnection();
            const subscribeEvent = "spot/account:" + currency;
            if (this._subscribeEvents.includes(subscribeEvent)) {
                if (this._isLogined) {
                    connection.unsubscribe(subscribeEvent);
                }
                this._subscribeEvents.splice(this._subscribeEvents.findIndex(value => value === subscribeEvent), 1);
            }
            else if (this._pendingSubscribeEvents.includes(subscribeEvent)) {
                this._pendingSubscribeEvents.splice(this._pendingSubscribeEvents.findIndex(value => value === subscribeEvent), 1);
            }
            return "spot/account:" + currency;
        });
    }
    onOkexConnectionOpened() {
        console.log("[WalletMonitor] okexConnection opened");
        this._stopExpiredTimer();
        if (!this._isLogined) {
            this._login();
        }
    }
    onOkexConnectionClosed() {
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
    onOkexConnectionLogined() {
        console.log("[WalletMonitor] okexConnection logined");
        this._isLogined = true;
        // this._initializeSubscribes();
        const connection = this._checkOkexConnection();
        this._pendingSubscribeEvents.forEach(eventName => {
            console.log("[WalletMonitor] okexConnection subscribe pending:", eventName);
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
                    console.log("[WalletMonitor] okexConnection error:", jsonData.errorCode, jsonData.message);
                }
                else {
                    console.log("[WalletMonitor] okexConnection message:", jsonData.event, jsonData.channel);
                }
            }
            else if (jsonData.table && typeof jsonData.table === "string") {
                if (jsonData.table === "spot/account") {
                    // console.log("[WalletMonitor] acceptd spot/account:", JSON.stringify(jsonData.data));
                    const filter = new Map();
                    for (let wallet of jsonData.data) {
                        let holdWallet = [];
                        if (filter.has(wallet.currency)) {
                            holdWallet = filter.get(wallet.currency);
                        }
                        holdWallet.push(wallet);
                        filter.set(wallet.currency, holdWallet);
                    }
                    for (let currency of filter.keys()) {
                        const notificationName = "spot/account:" + currency;
                        // console.log("[WalletMonitor] sendNotification:", JSON.stringify({ event: notificationName, data: filter.get(currency) }));
                        Facade_1.default.getInstance().sendNotification(notificationName, filter.get(currency));
                    }
                }
            }
            else {
                console.log("[WalletMonitor] onOkexConnectionMessage unhandle:", data);
            }
        }
        catch (error) {
            console.log("[WalletMonitor] exception:", error);
        }
        // // TODO: flag checked
        // if (!this._isLogined) {
        //     this._login();
        // }
    }
}
exports.default = WalletMonitor;
