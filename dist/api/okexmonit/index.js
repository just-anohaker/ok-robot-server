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
function monitSpotTrade(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateMonitSpotTrade(data);
        if (validation) {
            return Utils_1.apiFailure(validation);
        }
        try {
            const resp = Utils_1.ProxyHelper.OkexMonitProxy.monitSpotTrade(data.instrument_id);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function unmonitSpotTrade(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateUnmonitSpotTrade(data);
        if (validation) {
            return Utils_1.apiFailure(validation);
        }
        try {
            const resp = Utils_1.ProxyHelper.OkexMonitProxy.unmonitSpotTrade(data.instrument_id);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function monitSpotTicker(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateMonitSpotTicker(data);
        if (validation) {
            return Utils_1.apiFailure(validation);
        }
        try {
            const resp = Utils_1.ProxyHelper.OkexMonitProxy.monitSpotTicker(data.instrument_id);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function unmonitSpotTicker(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateUnmonitSpotTicker(data);
        if (validation) {
            return Utils_1.apiFailure(validation);
        }
        try {
            const resp = Utils_1.ProxyHelper.OkexMonitProxy.unmonitSpotTicker(data.instrument_id);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function monitSpotChannel(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateMonitSpotChannel(data);
        if (validation) {
            return Utils_1.apiFailure(validation);
        }
        try {
            const resp = Utils_1.ProxyHelper.OkexMonitProxy.monitSpotChannel(data.channel_name, data.filter);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function unmonitSpotChannel(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateUnmonitSpotChannel(data);
        if (validation) {
            return Utils_1.apiFailure(validation);
        }
        try {
            const resp = Utils_1.ProxyHelper.OkexMonitProxy.unmonitSpotChannel(data.channel_name, data.filter);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function monitSpotDepth(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateMonitSpotDepth(data);
        if (validation) {
            return Utils_1.apiFailure(validation);
        }
        try {
            const resp = yield Utils_1.ProxyHelper.OkexMonitProxy.monitDepth(data.account, data.instrument_id);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function unmonitSpotDepth(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateUnmonitSpotDepth(data);
        if (validation) {
            return Utils_1.apiFailure(validation);
        }
        try {
            const resp = yield Utils_1.ProxyHelper.OkexMonitProxy.unmonitDepth(data.account, data.instrument_id);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function monitWallet(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateMonitWallet(data);
        if (validation) {
            return Utils_1.apiFailure(validation);
        }
        try {
            const resp = yield Utils_1.ProxyHelper.OkexMonitProxy.monitWallet(data.account, data.currency);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
function unmonitWallet(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateUnmonitWallet(data);
        if (validation) {
            return Utils_1.apiFailure(validation);
        }
        try {
            const resp = yield Utils_1.ProxyHelper.OkexMonitProxy.unmonitWallet(data.account, data.currency);
            return Utils_1.apiSuccess(resp);
        }
        catch (error) {
            return Utils_1.apiFailure(error.toString());
        }
    });
}
exports.default = {
    monitSpotTrade,
    unmonitSpotTrade,
    monitSpotTicker,
    unmonitSpotTicker,
    monitSpotChannel,
    unmonitSpotChannel,
    monitSpotDepth,
    unmonitSpotDepth,
    monitWallet,
    unmonitWallet
};
