"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../Utils");
function getSpotTicker(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield Utils_1.ProxyHelper.OkexUtilsProxy.getSpotTicker(data);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error);
        }
    });
}
function getSpotTrade(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield Utils_1.ProxyHelper.OkexUtilsProxy.getSpotTrade(data);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error);
        }
    });
}
function getSpotCandles(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield Utils_1.ProxyHelper.OkexUtilsProxy.getSpotCandles(data);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error);
        }
    });
}
exports.default = {
    getSpotTicker,
    getSpotTrade,
    getSpotCandles
};
// async function generate(data: MarkedMap): Promise<APIReturn> {
//     const validation = Schema.validateGenerate(data);
//     if (validation !== undefined) {
//         return apiFailure(validation);
//     }
//     try {
//         const resp = await ProxyHelper.BatchOrderProxy.generate(data.options, data.account);
//         return apiSuccess(resp);
//     } catch (error) {
//         return apiFailure(error.toString());
//     }
// }
// // async function start(data: MarkedMap): Promise<APIReturn> {
// //     const validation = Schema.validateStart(data);
// //     if (validation !== undefined) {
// //         return apiFailure(validation);
// //     }
// //     const resp =await ProxyHelper.BatchOrderProxy.start(data.client_oids);
// //     return apiSuccess(resp);
// // }
// async function cancel(data: MarkedMap): Promise<APIReturn> {
//     const validation = Schema.validateCancel(data);
//     if (validation !== undefined) {
//         return apiFailure(validation);
//     }
//     try {
//         const resp = await ProxyHelper.BatchOrderProxy.cancel(data.options, data.account);
//         return apiSuccess(resp);
//     } catch (error) {
//         return apiFailure(error.toString());
//     }
// }
// async function limitOrder(data: MarkedMap): Promise<APIReturn> {
//     const validation = Schema.validateCancel(data);
//     if (validation !== undefined) {
//         return apiFailure(validation);
//     }
//     try {
//         const resp = await ProxyHelper.BatchOrderProxy.limitOrder(data.options, data.account);
//         return apiSuccess(resp);
//     } catch (error) {
//         return apiFailure(error.toString());
//     }
// }
// async function marketOrder(data: MarkedMap): Promise<APIReturn> {
//     const validation = Schema.validateCancel(data);
//     if (validation !== undefined) {
//         return apiFailure(validation);
//     }
//     try {
//         const resp = await ProxyHelper.BatchOrderProxy.marketOrder(data.options, data.account);
//         return apiSuccess(resp);
//     } catch (error) {
//         return apiFailure(error.toString());
//     }
// }
// async function startDepInfo(data: MarkedMap): Promise<APIReturn> {
//     // const validation = Schema.validateCancel(data);
//     // if (validation !== undefined) {
//     //     return apiFailure(validation);
//     // }
//     try {
//         const resp = await ProxyHelper.BatchOrderProxy.startDepInfo(data.options);
//         return apiSuccess(resp);
//     } catch (error) {
//         return apiFailure(error.toString());
//     }
// }
// async function stopDepInfo(data: MarkedMap): Promise<APIReturn> {
//     // const validation = Schema.validateCancel(data);
//     // if (validation !== undefined) {
//     //     return apiFailure(validation);
//     // }
//     try {
//         const resp = await ProxyHelper.BatchOrderProxy.stopDepInfo(data.options);
//         return apiSuccess(resp);
//     } catch (error) {
//         return apiFailure(error.toString());
//     }
// }
// async function pageKline(data: MarkedMap): Promise<APIReturn> {
//     try {
//         const resp = await ProxyHelper.BatchOrderProxy.pageKline(data.options);
//         return apiSuccess(resp);
//     } catch (error) {
//         return apiFailure(error.toString());
//     }
// }
// async function pageInfo(data: MarkedMap): Promise<APIReturn> {
//     try {
//         const resp = await ProxyHelper.BatchOrderProxy.pageInfo(data.options);
//         return apiSuccess(resp);
//     } catch (error) {
//         return apiFailure(error.toString());
//     }
// }
// async function getOrderData(data: MarkedMap): Promise<APIReturn> {
//     // const validation = Schema.validateCancel(data);
//     // if (validation !== undefined) {
//     //     return apiFailure(validation);
//     // }
//     try {
//         const resp = await ProxyHelper.BatchOrderProxy.getOrderData(data.options, data.account);
//         return apiSuccess(resp);
//     } catch (error) {
//         return apiFailure(error.toString());
//     }
// }
// export default {
//     generate,
//     cancel,
//     limitOrder,
//     marketOrder,
//     startDepInfo,
//     stopDepInfo,
//     getOrderData,
//     pageInfo,
//     pageKline
// }
