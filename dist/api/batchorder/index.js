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
const Utils_1 = require("../Utils");
const Schema_1 = __importDefault(require("./Schema"));
function generate(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateGenerate(data);
        if (validation !== undefined) {
            return Utils_1.apiFailure(validation);
        }
        try {
            const resp = yield Utils_1.ProxyHelper.BatchOrderProxy.generate(data.options, data.account);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
// async function start(data: MarkedMap): Promise<APIReturn> {
//     const validation = Schema.validateStart(data);
//     if (validation !== undefined) {
//         return apiFailure(validation);
//     }
//     const resp =await ProxyHelper.BatchOrderProxy.start(data.client_oids);
//     return apiSuccess(resp);
// }
function cancel(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateCancel(data);
        if (validation !== undefined) {
            return Utils_1.apiFailure(validation);
        }
        try {
            const resp = yield Utils_1.ProxyHelper.BatchOrderProxy.cancel(data.options, data.account);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function limitOrder(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateCancel(data);
        if (validation !== undefined) {
            return Utils_1.apiFailure(validation);
        }
        try {
            const resp = yield Utils_1.ProxyHelper.BatchOrderProxy.limitOrder(data.options, data.account);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function marketOrder(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateCancel(data);
        if (validation !== undefined) {
            return Utils_1.apiFailure(validation);
        }
        try {
            const resp = yield Utils_1.ProxyHelper.BatchOrderProxy.marketOrder(data.options, data.account);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
exports.default = {
    generate,
    cancel,
    limitOrder,
    marketOrder
};
