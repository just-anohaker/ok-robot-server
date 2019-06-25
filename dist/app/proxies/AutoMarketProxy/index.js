"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Proxy_1 = __importDefault(require("../../../patterns/proxy/Proxy"));
const autoMarket_1 = __importDefault(require("./autoMarket"));
class AutoMarketProxy extends Proxy_1.default {
    constructor() {
        super(AutoMarketProxy.NAME);
    }
    onRegister() {
        // TODO
    }
    init(options /*AutoMarketOptions*/, account /*OKexAccount*/) {
        // TODO
        try {
            autoMarket_1.default.initAutoMarket(options, account);
        }
        catch (error) {
            return {
                result: false,
                error_message: error
            };
        }
        return { result: true };
    }
    stop() {
        // TODO
        return autoMarket_1.default.stopAutoMarket();
    }
    start() {
        // TODO
        return false;
    }
    isRunning() {
        // TODO
        return autoMarket_1.default.isRunning();
    }
    get OptionsAndAccount() {
        // TODO
        let p = autoMarket_1.default.getParamsAndAcct();
        return {
            options: p.params,
            account: p.acct
        };
    }
}
AutoMarketProxy.NAME = "PROXY_AUTO_MAKRET";
exports.default = AutoMarketProxy;
