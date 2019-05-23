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
const Facade_1 = __importDefault(require("../../patterns/facade/Facade"));
const UserProxy_1 = __importDefault(require("../../app/proxies/UserProxy"));
const UserMediator_1 = __importDefault(require("../../app/mediatores/UserMediator"));
const Common_1 = require("../Common");
const Schema_1 = __importDefault(require("./Schema"));
const getUserProxy = (() => {
    let _userProxy = undefined;
    return () => {
        if (_userProxy === undefined) {
            _userProxy = Facade_1.default.getInstance().retrieveProxy(UserProxy_1.default.NAME, UserProxy_1.default);
        }
        return _userProxy;
    };
})();
const getUserMediator = (() => {
    let _userMediator = undefined;
    return () => {
        if (_userMediator === undefined) {
            _userMediator = Facade_1.default.getInstance().retrieveMediator(UserMediator_1.default.NAME, UserMediator_1.default);
        }
        return _userMediator;
    };
})();
function getAll() {
    return __awaiter(this, void 0, void 0, function* () {
        const allUsers = getUserMediator().getAllUsers();
        return Common_1.apiSuccess(allUsers.map(value => ({
            id: value.id,
            groupName: value.groupName,
            name: value.name,
            apiKey: value.apiKey,
            apiSecret: value.apiSecret
        })));
    });
}
function get(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateGetUser(data || {});
        if (validation !== undefined) {
            return Common_1.apiFailure(validation);
        }
        const user = getUserProxy().get(data.userId);
        if (user) {
            return Common_1.apiSuccess({
                id: user.id,
                groupName: user.groupName,
                name: user.name,
                apikey: user.apiKey,
                apiSecret: user.apiSecret
            });
        }
        return Common_1.apiFailure(`Maybe user with userId(${data.userId}) not exists`);
    });
}
function add(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateAddUser(data || {});
        if (validation !== undefined) {
            return Common_1.apiFailure(validation);
        }
        const newUser = getUserProxy().add(data.groupName, {
            name: data.name,
            apiKey: data.apiKey,
            apiSecret: data.apiSecret
        });
        if (newUser) {
            return Common_1.apiSuccess({
                id: newUser.id,
                groupName: newUser.groupName,
                name: newUser.name,
                apiKey: newUser.apiKey,
                apiSecret: newUser.apiSecret
            });
        }
        return Common_1.apiFailure(`Maybe user with name(${data.name}) and group(${data.groupName}) exists`);
    });
}
function update(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateUpdateUser(data);
        if (validation !== undefined) {
            return Common_1.apiFailure(validation);
        }
        const updateUser = getUserProxy().update(data.userId, {
            groupName: data.options.groupName,
            name: data.options.name,
            apiKey: data.options.apiKey,
            apiSecret: data.options.apiSecret
        });
        if (updateUser) {
            return Common_1.apiSuccess({
                id: updateUser.id,
                groupName: updateUser.groupName,
                name: updateUser.name,
                apiKey: updateUser.apiKey,
                apiSecret: updateUser.apiSecret
            });
        }
        return Common_1.apiFailure(`Maybe user with userId(${data.userId}) not exists`);
    });
}
function remove(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateRemoveUser(data);
        if (validation !== undefined) {
            return Common_1.apiSuccess(validation);
        }
        const removeUser = getUserProxy().remove(data.userId);
        if (removeUser) {
            return Common_1.apiSuccess({
                id: removeUser.id,
                groupName: removeUser.groupName,
                name: removeUser.name,
                apiKey: removeUser.apiKey,
                apiSecret: removeUser.apiSecret
            });
        }
        return Common_1.apiFailure(`Maybe user with userId(${data.userId}) not exists`);
    });
}
exports.default = {
    getAll,
    get,
    add,
    remove,
    update
};
