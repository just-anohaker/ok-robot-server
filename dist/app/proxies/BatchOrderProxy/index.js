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
const Proxy_1 = __importDefault(require("../../../patterns/proxy/Proxy"));
const __1 = require("../../..");
const batchOrder_1 = __importDefault(require("./batchOrder"));
const acctInfo_1 = __importDefault(require("../../acctInfo"));
class BatchOrderProxy extends Proxy_1.default {
    constructor() {
        super(BatchOrderProxy.NAME);
        this.accountInfo = [];
    }
    onRegister() {
        // TODO
    }
    generate(options /*BatchOrderOptions*/, account /*OKexAccount*/) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield batchOrder_1.default.genBatchOrder(options, account);
        });
    }
    // start(client_oids: any /*string[]*/): boolean {
    //     return batchOrder.startBatchOrder(client_oids);
    // }
    cancel(options /*BatchOrderCancelOptions*/, account /*OKexAccount*/) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield batchOrder_1.default.cancelBatchOrder(options, account);
        });
    }
    limitOrder(options /*BatchOrderCancelOptions*/, account /*OKexAccount*/) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield batchOrder_1.default.limitOrder(options, account);
        });
    }
    marketOrder(options /*BatchOrderCancelOptions*/, account /*OKexAccount*/) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield batchOrder_1.default.marketOrder(options, account);
        });
    }
    stopDepInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield batchOrder_1.default.stopDepInfo();
        });
    }
    getOrderData(options /*BatchOrderCancelOptions*/, account /*OKexAccount*/) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield batchOrder_1.default.getOrderData(options, account);
        });
    }
    startDepInfo(account /*OKexAccount*/) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let acctinfo = acctInfo_1.default(account.httpkey, account.httpsecret, account.passphrase);
                const depthEventName = "depth";
                acctinfo.event.on(depthEventName, this.onEventHandler(depthEventName));
                this.accountInfo.push(acctinfo);
            }
            catch (error) {
                return {
                    result: false,
                    error_message: error
                };
            }
            return { result: true };
        });
    }
    onEventHandler(eventName) {
        return data => {
            __1.Facade.getInstance().sendNotification(eventName, data);
        };
    }
}
BatchOrderProxy.NAME = "PROXY_BATCH_ORDER";
exports.default = BatchOrderProxy;
