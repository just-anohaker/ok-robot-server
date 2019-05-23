"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mediator_1 = __importDefault(require("../../patterns/mediator/Mediator"));
const UserProxy_1 = __importDefault(require("../proxies/UserProxy"));
class UserMediator extends Mediator_1.default {
    constructor() {
        super(UserMediator.NAME);
    }
    _checkProxy() {
        if (this._userProxy === undefined) {
            this._userProxy = this.facade.retrieveProxy(UserProxy_1.default.NAME, UserProxy_1.default);
        }
    }
    getAllUsers() {
        this._checkProxy();
        const userGroup = this._userProxy.Groups;
        let result = [];
        if (userGroup) {
            userGroup.forEach(group => {
                group.accounts.forEach(account => result.push(account));
            });
        }
        return result;
    }
}
UserMediator.NAME = "MEDIATOR_USER";
exports.default = UserMediator;
