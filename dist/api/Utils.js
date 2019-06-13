"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Facade_1 = __importDefault(require("../patterns/facade/Facade"));
// proxies
const UserProxy_1 = __importDefault(require("../app/proxies/UserProxy"));
// import VolumeMakerProxy from "../app/proxies/VolumeMaker";
const AutoMakerProxy_1 = __importDefault(require("../app/proxies/AutoMakerProxy"));
const AutoMarketProxy_1 = __importDefault(require("../app/proxies/AutoMarketProxy"));
const BatchOrderProxy_1 = __importDefault(require("../app/proxies/BatchOrderProxy"));
const TakeOrderProxy_1 = __importDefault(require("../app/proxies/TakeOrderProxy"));
const OkexUtilsProxy_1 = __importDefault(require("../app/proxies/OkexUtilsProxy"));
// mediators
const UserMediator_1 = __importDefault(require("../app/mediatores/UserMediator"));
function apiSuccess(result) {
    return {
        success: true,
        result
    };
}
exports.apiSuccess = apiSuccess;
function apiFailure(error) {
    return {
        success: false,
        error
    };
}
exports.apiFailure = apiFailure;
class ProxyHelper {
    // getters
    static get UserProxy() {
        return Facade_1.default.getInstance().retrieveProxy(UserProxy_1.default.NAME, UserProxy_1.default);
    }
    // static get VolumeMakerProxy(): VolumeMakerProxy {
    //     return Facade.getInstance().retrieveProxy(VolumeMakerProxy.NAME, VolumeMakerProxy);
    // }
    static get AutoMakerProxy() {
        return Facade_1.default.getInstance().retrieveProxy(AutoMakerProxy_1.default.NAME, AutoMakerProxy_1.default);
    }
    static get AutoMarketProxy() {
        return Facade_1.default.getInstance().retrieveProxy(AutoMarketProxy_1.default.NAME, AutoMarketProxy_1.default);
    }
    static get BatchOrderProxy() {
        return Facade_1.default.getInstance().retrieveProxy(BatchOrderProxy_1.default.NAME, BatchOrderProxy_1.default);
    }
    static get TakeOrderProxy() {
        return Facade_1.default.getInstance().retrieveProxy(TakeOrderProxy_1.default.NAME, TakeOrderProxy_1.default);
    }
    static get OkexUtilsProxy() {
        return Facade_1.default.getInstance().retrieveProxy(OkexUtilsProxy_1.default.NAME, OkexUtilsProxy_1.default);
    }
}
exports.ProxyHelper = ProxyHelper;
class MediatorHelper {
    // getters
    static get UserMediator() {
        return Facade_1.default.getInstance().retrieveMediator(UserMediator_1.default.NAME, UserMediator_1.default);
    }
}
exports.MediatorHelper = MediatorHelper;
