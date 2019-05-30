"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mediator_1 = __importDefault(require("../../../patterns/mediator/Mediator"));
const UserProxy_1 = __importDefault(require("../../proxies/UserProxy"));
class UserMediator extends Mediator_1.default {
    constructor() {
        super(UserMediator.NAME);
    }
    get UserProxy() {
        return this.facade.retrieveProxy(UserProxy_1.default.NAME, UserProxy_1.default);
    }
    getAllUsers() {
        const allUsers = this.UserProxy.AllAccounts;
        allUsers.sort((a, b) => {
            return a > b ? -1 : (a < b ? 1 : 0);
        });
        return allUsers;
    }
}
UserMediator.NAME = "MEDIATOR_USER";
exports.default = UserMediator;
