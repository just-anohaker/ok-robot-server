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
const Proxy_1 = __importDefault(require("../../../patterns/proxy/Proxy"));
const Facade_1 = __importDefault(require("../../../patterns/facade/Facade"));
const DepthMonitor_1 = __importDefault(require("./internal/DepthMonitor"));
const ExpiredTimeout = 30000;
class OkexMonitProxy extends Proxy_1.default {
    constructor() {
        super(OkexMonitProxy.NAME);
        this._registerChannels = new Map();
        this._okexDepthMonitor = [];
    }
    onRegister() {
        // TODO
        // initialize okex connection
        this._checkOkexConnection();
    }
    _startExpiredTimer() {
        this._stopExpiredTimer();
        this._expiredTimeoutHandler = setTimeout(() => {
            console.log("[OkexMonitProxy] ExpiredTimeout happened");
            this._expiredTimeoutHandler = undefined;
            if (this._okexConnection) {
                const holdOkexConnection = this._okexConnection;
                this._okexConnection = undefined;
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
    _checkOkexConnection() {
        if (this._okexConnection === undefined) {
            this._okexConnection = new okex_node_1.V3WebsocketClient();
            this._okexConnection.on("open", () => this.onOkexConnectionOpened());
            this._okexConnection.on("close", () => this.onOkexConnectionClosed());
            this._okexConnection.on("message", (data) => this.onOkexConnectionMessage(data));
            this._okexConnection.connect();
            this._startExpiredTimer();
        }
        return this._okexConnection;
    }
    monitSpotTrade(instrumentId) {
        return this.monitChannel(`${"spot/trade" /* SpotTrade */}:${instrumentId}`);
    }
    unmonitSpotTrade(instrumentId) {
        return this.unmonitChannel(`${"spot/trade" /* SpotTrade */}:${instrumentId}`);
    }
    monitSpotTicker(instrumentId) {
        return this.monitChannel(`${"spot/ticker" /* SpotTicker */}:${instrumentId}`);
    }
    unmonitSpotTicker(instrumentId) {
        return this.unmonitChannel(`${"spot/ticker" /* SpotTicker */}:${instrumentId}`);
    }
    monitSpotChannel(channelName, filter) {
        return this.monitChannel(`spot/${channelName}:${filter}`);
    }
    unmonitSpotChannel(channelName, filter) {
        return this.unmonitChannel(`spot/${channelName}:${filter}`);
    }
    monitChannel(channelName) {
        const okexConnection = this._checkOkexConnection();
        if (!this._registerChannels.has(channelName) ||
            this._registerChannels.get(channelName) === false) {
            try {
                okexConnection.subscribe(channelName);
                this._registerChannels.set(channelName, true);
                console.log(`[OkexMonitProxy] subscribe(${channelName}) success.`);
            }
            catch (error) {
                console.log(`[OkexMonitProxy] subscribe(${channelName}) failure, exception: ${error}.`);
                this.onOkexConnectionClosed();
                throw error;
            }
        }
        return channelName;
    }
    unmonitChannel(channelName) {
        const okexConnection = this._checkOkexConnection();
        if (this._registerChannels.has(channelName) &&
            this._registerChannels.get(channelName) === true) {
            try {
                okexConnection.unsubscribe(channelName);
                this._registerChannels.set(channelName, false);
                console.log(`[OkexMonitProxy] unsubscribe(${channelName}) success.`);
            }
            catch (error) {
                console.log(`[OkexMonitProxy] unsubscribe(${channelName}) failure, exception: ${error}.`);
                throw error;
            }
        }
        return channelName;
    }
    monitDepth(account, instrucment_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = this._okexDepthMonitor.filter(monitor => monitor.compareAccount(account));
            let depthMonitor;
            if (found.length <= 0) {
                depthMonitor = new DepthMonitor_1.default(account.httpkey, account.httpsecret, account.passphrase);
                this._okexDepthMonitor.push(depthMonitor);
            }
            else {
                depthMonitor = found[0];
            }
            return yield depthMonitor.monit(instrucment_id);
        });
    }
    unmonitDepth(account, instrucment_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = this._okexDepthMonitor.filter(monitor => monitor.compareAccount(account));
            if (found.length > 0) {
                return yield found[0].unmonit(instrucment_id);
            }
            return "spot/depth:" + instrucment_id;
        });
    }
    onOkexConnectionOpened() {
        console.log("[OkexMonitProxy] okexConnection opened");
        this._stopExpiredTimer();
        this._registerChannels.forEach((value, key) => {
            if (value === true) {
                this._okexConnection.subscribe(key);
            }
        });
    }
    onOkexConnectionClosed() {
        console.log("[OkexMonitProxy] okexConnection closed");
        this._okexConnection = undefined;
        this._stopExpiredTimer();
        this._checkOkexConnection();
    }
    onOkexConnectionMessage(data) {
        // console.log("[OkexMonitProxy] okexConnection message recieved:", typeof data, data);
        try {
            const jsonData = JSON.parse(data);
            if (jsonData.event && typeof jsonData.event === "string") {
                if (jsonData.event === "login") {
                    /// TODO: login
                }
                else if (jsonData.event === "error") {
                    console.log("[OkexMonitProxy] okexConnection error:", jsonData.errorCode, jsonData.message);
                }
                else {
                    console.log("[OkexMonitProxy] okexConnection message:", jsonData.event, jsonData.channel);
                }
            }
            else if (jsonData.table && typeof jsonData.table === "string") {
                const respData = jsonData.data;
                if (Array.isArray(respData) && respData.length > 0) {
                    const notificationName = jsonData.table + ":" + respData[0].instrument_id;
                    Facade_1.default.getInstance().sendNotification(notificationName, respData);
                }
            }
            else {
                console.log("[OkexMonitProxy] onOkexConnectionMessage unhandle:", data);
            }
        }
        catch (error) {
            console.log("[OkexMonitProxy] exception:", error);
        }
    }
}
OkexMonitProxy.NAME = "PROXY_OKEX_MONIT";
exports.default = OkexMonitProxy;
