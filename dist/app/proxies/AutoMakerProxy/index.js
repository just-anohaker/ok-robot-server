"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Proxy_1 = __importDefault(require("../../../patterns/proxy/Proxy"));
class AutoMakerProxy extends Proxy_1.default {
    constructor() {
        super(AutoMakerProxy.NAME);
    }
    onRegister() {
        // TODO
    }
    init(options, account) {
        // TODO
    }
    stop() {
        // TODO
        return true;
    }
    start() {
        // TODO
        return true;
    }
    isRunning() {
        // TODO
        return true;
    }
    get OptionsAndAccount() {
        // TODO
        return undefined;
    }
}
AutoMakerProxy.NAME = "PROXY_AUTO_MAKER";
exports.default = AutoMakerProxy;
