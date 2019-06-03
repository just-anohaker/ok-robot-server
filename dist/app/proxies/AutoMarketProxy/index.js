"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Proxy_1 = __importDefault(require("../../../patterns/proxy/Proxy"));
class AutoMarketProxy extends Proxy_1.default {
    constructor() {
        super(AutoMarketProxy.NAME);
    }
    onRegister() {
        // TODO
    }
    init(options, account) {
        // TODO
    }
    stop() {
        // TODO
    }
    start() {
        // TODO
    }
    isRunning() {
        // TODO
        return false;
    }
    get OptionsAndAccount() {
        // TODO
        return undefined;
    }
}
AutoMarketProxy.NAME = "PROXY_AUTO_MAKRET";
exports.default = AutoMarketProxy;
