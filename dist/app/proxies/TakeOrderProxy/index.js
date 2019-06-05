"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Proxy_1 = __importDefault(require("../../../patterns/proxy/Proxy"));
class TakeOrderProxy extends Proxy_1.default {
    constructor() {
        super(TakeOrderProxy.NAME);
    }
    onRegister() {
        // TODO
    }
    generate(options /*TakeOrderOptions*/, account /*OKexAccount*/) {
        // TODO
        return undefined;
    }
    start(client_oids /*string[]*/) {
        // TODO
        return false;
    }
}
TakeOrderProxy.NAME = "PROXY_TAKE_ORDER";
exports.default = TakeOrderProxy;
