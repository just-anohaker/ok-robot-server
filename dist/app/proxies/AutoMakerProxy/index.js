"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Proxy_1 = __importDefault(require("../../../patterns/proxy/Proxy"));
const autoMaker_1 = __importDefault(require("./autoMaker"));
class AutoMakerProxy extends Proxy_1.default {
    constructor() {
        super(AutoMakerProxy.NAME);
    }
    onRegister() {
        // TODO
    }
    init(options /* AutoMakerOptions*/, account /*OKexAccount*/) {
        console.log("initAutoMaker");
        return autoMaker_1.default.initAutoMaker(options, account);
    }
    stop() {
        return autoMaker_1.default.stopAutoTrade();
    }
    start() {
        return autoMaker_1.default.startAutoTrade();
    }
    isRunning() {
        return autoMaker_1.default.isRunning();
    }
    getOrderInfo(options /* AutoMakerOptions*/, account /*OKexAccount*/) {
        console.log("getOrderInfo");
        return autoMaker_1.default.getOrderInfo(options, account);
    }
    get OptionsAndAccount() {
        let p = autoMaker_1.default.getParamsAndAcct();
        return {
            options: p.params,
            account: p.acct
        };
    }
}
AutoMakerProxy.NAME = "PROXY_AUTO_MAKER";
exports.default = AutoMakerProxy;
