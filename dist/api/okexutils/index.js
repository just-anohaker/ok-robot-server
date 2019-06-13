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
            const resp = yield Utils_1.ProxyHelper.OkexUtilsProxy.getSpotTicker(data.options);
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
            const resp = yield Utils_1.ProxyHelper.OkexUtilsProxy.getSpotTrade(data.options);
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
            const resp = yield Utils_1.ProxyHelper.OkexUtilsProxy.getSpotCandles(data.options);
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
