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
function toBatchOrder(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateGenerate(data);
        if (validation !== undefined) {
            return Utils_1.apiFailure(validation);
        }
        try {
            const resp = yield Utils_1.ProxyHelper.BatchOrderProxy.toBatchOrder(data.options, data.account);
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
function startDepInfo(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // const validation = Schema.validateCancel(data);
        // if (validation !== undefined) {
        //     return apiFailure(validation);
        // }
        try {
            const resp = yield Utils_1.ProxyHelper.BatchOrderProxy.startDepInfo(data.options);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function stopDepInfo(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // const validation = Schema.validateCancel(data);
        // if (validation !== undefined) {
        //     return apiFailure(validation);
        // }
        try {
            const resp = yield Utils_1.ProxyHelper.BatchOrderProxy.stopDepInfo(data.options);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function pageKline(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield Utils_1.ProxyHelper.BatchOrderProxy.pageKline(data.options);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function pageInfo(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield Utils_1.ProxyHelper.BatchOrderProxy.pageInfo(data.options);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function getOrderData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // const validation = Schema.validateCancel(data);
        // if (validation !== undefined) {
        //     return apiFailure(validation);
        // }
        try {
            const resp = yield Utils_1.ProxyHelper.BatchOrderProxy.getOrderData(data.options, data.account);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function getTradeData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield Utils_1.ProxyHelper.BatchOrderProxy.getTradeData(data.options);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function getCandlesData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield Utils_1.ProxyHelper.BatchOrderProxy.getCandlesData(data.options);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function addWarnings(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield Utils_1.ProxyHelper.BatchOrderProxy.addWarnings(data.options, data.account);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function isWarnings(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield Utils_1.ProxyHelper.BatchOrderProxy.isWarnings(data.options, data.account);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function startWarnings(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield Utils_1.ProxyHelper.BatchOrderProxy.startWarnings(data.options, data.account);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function stopWarnings(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield Utils_1.ProxyHelper.BatchOrderProxy.stopWarnings(data.options, data.account);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function removeWarnings(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield Utils_1.ProxyHelper.BatchOrderProxy.removeWarnings(data.options, data.account);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function listWarnings(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield Utils_1.ProxyHelper.BatchOrderProxy.listWarnings(data.options, data.account);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
exports.default = {
    generate,
    toBatchOrder,
    cancel,
    limitOrder,
    marketOrder,
    startDepInfo,
    stopDepInfo,
    getOrderData,
    pageInfo,
    pageKline,
    getTradeData,
    getCandlesData,
    addWarnings,
    removeWarnings,
    startWarnings,
    isWarnings,
    stopWarnings,
    listWarnings
};
