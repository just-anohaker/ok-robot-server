"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const okex_node_1 = require("@okfe/okex-node");
const Proxy_1 = __importDefault(require("../../../patterns/proxy/Proxy"));
const ExpiredTimeout = 30000;
class OkexMonitProxy extends Proxy_1.default {
    constructor() {
        super(OkexMonitProxy.NAME);
        this._registerChannels = new Map();
    }
    onRegister() {
        // TODO
        // initialize okex connection
        this._checkOkexConnection();
    }
    _checkOkexConnection() {
        if (this._okexConnection === undefined) {
            this._okexConnection = new okex_node_1.V3WebsocketClient();
            this._okexConnection.on("open", () => this.onOkexConnectionOpened());
            this._okexConnection.on("close", () => this.onOkexConnectionClosed());
            this._okexConnection.on("message", (data) => this.onOkexConnectionMessage(data));
            this._registerChannels.forEach((value, key) => {
                if (value === true) {
                    this._okexConnection.subscribe(key);
                }
            });
            this._okexConnection.connect();
            if (this._expiredTimeoutHandler !== undefined) {
                clearTimeout(this._expiredTimeoutHandler);
                this._expiredTimeoutHandler = undefined;
            }
            this._expiredTimeoutHandler = setTimeout(() => {
                console.log("[OkexMonitProxy] ExpiredTimeout happened");
                this._expiredTimeoutHandler = undefined;
                if (this._okexConnection) {
                    return this._okexConnection.close();
                }
                this._checkOkexConnection();
            }, ExpiredTimeout);
        }
        return this._okexConnection;
    }
    monitSpotTrade(instrumentId) {
        return this.monitSpotChannel(`${"spot/trade" /* SpotTrade */}:${instrumentId}`);
    }
    unmonitSpotTrade(instrumentId) {
        return this.unmonitSpotChannel(`${"spot/trade" /* SpotTrade */}:${instrumentId}`);
    }
    monitSpotTicker(instrumentId) {
        return this.monitSpotChannel(`${"spot/ticker" /* SpotTicker */}:${instrumentId}`);
    }
    unmonitSpotTicker(instrumentId) {
        return this.unmonitSpotChannel(`${"spot/ticker" /* SpotTicker */}:${instrumentId}`);
    }
    monitSpotChannel(channelName) {
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
                throw error;
            }
        }
        return {
            result: true,
            notificationName: channelName
        };
        ;
    }
    unmonitSpotChannel(channelName) {
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
        return {
            result: true,
            notificationName: channelName
        };
    }
    onOkexConnectionOpened() {
        console.log("[OkexMonitProxy] okexConnection opened");
        if (this._expiredTimeoutHandler !== undefined) {
            clearTimeout(this._expiredTimeoutHandler);
            this._expiredTimeoutHandler = undefined;
        }
    }
    onOkexConnectionClosed() {
        console.log("[OkexMonitProxy] okexConnection closed");
        if (this._expiredTimeoutHandler !== undefined) {
            clearTimeout(this._expiredTimeoutHandler);
            this._expiredTimeoutHandler = undefined;
        }
        this._okexConnection = undefined;
        this._checkOkexConnection();
    }
    onOkexConnectionMessage(data) {
        console.log("[OkexMonitProxy] okexConnection message recieved:", data);
        // TODO
    }
}
OkexMonitProxy.NAME = "PROXY_OKEX_MONIT";
exports.default = OkexMonitProxy;
