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
            let result;
            try {
                result = yield batchOrder_1.default.genBatchOrder(options, account);
            }
            catch (error) {
                return {
                    result: false,
                    error_message: error + ''
                };
            }
            return result;
        });
    }
    toBatchOrder(options /*BatchOrderOptions*/, account /*OKexAccount*/) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                result = yield batchOrder_1.default.toBatchOrder(options, account);
            }
            catch (error) {
                return {
                    result: false,
                    error_message: error + ''
                };
            }
            return result;
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
    pageInfo(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield batchOrder_1.default.pageInfo(options);
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
    pageKline(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield batchOrder_1.default.pageKline(options);
        });
    }
    stopDepInfo(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield batchOrder_1.default.stopDepInfo(options);
        });
    }
    getOrderData(options /*BatchOrderCancelOptions*/, account /*OKexAccount*/) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield batchOrder_1.default.getOrderData(options, account);
        });
    }
    getTradeData(options /*BatchOrderCancelOptions*/) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield batchOrder_1.default.getTradeData(options);
        });
    }
    getCandlesData(options /*BatchOrderCancelOptions*/) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield batchOrder_1.default.getCandlesData(options);
        });
    }
    startDepInfo(options /*OKexAccount*/) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield batchOrder_1.default.startDepInfo(options);
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
