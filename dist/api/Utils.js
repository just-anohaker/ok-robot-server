"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Facade_1 = __importDefault(require("../patterns/facade/Facade"));
// proxies
const UserProxy_1 = __importDefault(require("../app/proxies/UserProxy"));
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
}
exports.ProxyHelper = ProxyHelper;
class MediatorHelper {
    // getters
    static get UserMediator() {
        return Facade_1.default.getInstance().retrieveMediator(UserMediator_1.default.NAME, UserMediator_1.default);
    }
}
exports.MediatorHelper = MediatorHelper;
