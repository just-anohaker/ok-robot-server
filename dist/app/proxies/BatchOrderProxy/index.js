"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Proxy_1 = __importDefault(require("../../../patterns/proxy/Proxy"));
class BatchOrderProxy extends Proxy_1.default {
    constructor() {
        super(BatchOrderProxy.NAME);
    }
    onRegister() {
        // TODO
    }
    generate(options /*BatchOrderOptions*/, account /*OKexAccount*/) {
        // TODO
        return undefined;
    }
    start(client_oids /*string[]*/) {
        // TODO
        return false;
    }
    cancel(options /*BatchOrderCancelOptions*/, account /*OKexAccount*/) {
        // TODO
        return undefined;
    }
}
BatchOrderProxy.NAME = "PROXY_BATCH_ORDER";
exports.default = BatchOrderProxy;
