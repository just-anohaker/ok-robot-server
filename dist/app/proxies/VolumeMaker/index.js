"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Proxy_1 = __importDefault(require("../../../patterns/proxy/Proxy"));
const Types_1 = require("../../Types");
const __1 = require("../../..");
const { setAutoTrade: nodeSetAutoTrade, startAutoTrade: nodeStartAutoTrade, stopAutoTrade: nodeStopAutoTrade, innerEvent } = require("./internal/volumeMaker");
class VolumeMakerProxy extends Proxy_1.default {
    constructor() {
        super(VolumeMakerProxy.NAME);
    }
    onRegister() {
        innerEvent.on(Types_1.NotificationDeep, this.onDeepEvent.bind(this));
        innerEvent.on(Types_1.NotificationTicker, this.onTickerEvent.bind(this));
        innerEvent.on(Types_1.NotificationOrder, this.onOrderEvent.bind(this));
    }
    setAutoTradeOptions(tradeOptions, account) {
        nodeSetAutoTrade(tradeOptions, account);
    }
    startAutoTrade() {
        nodeStartAutoTrade();
    }
    stopAutoTrade() {
        nodeStopAutoTrade();
    }
    onDeepEvent(info) {
        __1.Facade.getInstance().sendNotification(Types_1.NotificationDeep, info);
    }
    onTickerEvent(info) {
        __1.Facade.getInstance().sendNotification(Types_1.NotificationTicker, info);
    }
    onOrderEvent(info) {
        __1.Facade.getInstance().sendNotification(Types_1.NotificationOrder, info);
    }
}
VolumeMakerProxy.NAME = "PROXY_VOLUME_MAKER";
exports.default = VolumeMakerProxy;
