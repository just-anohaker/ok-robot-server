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
function getAll() {
    return __awaiter(this, void 0, void 0, function* () {
        const allUsers = Utils_1.MediatorHelper.UserMediator.getAllUsers();
        return Utils_1.apiSuccess(allUsers.map(value => ({
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
            return Utils_1.apiFailure(validation);
        }
        const user = Utils_1.ProxyHelper.UserProxy.get(data.userId);
        if (user) {
            return Utils_1.apiSuccess({
                id: user.id,
                groupName: user.groupName,
                name: user.name,
                apikey: user.apiKey,
                apiSecret: user.apiSecret
            });
        }
        return Utils_1.apiFailure(`Maybe user with userId(${data.userId}) not exists`);
    });
}
function add(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateAddUser(data || {});
        if (validation !== undefined) {
            return Utils_1.apiFailure(validation);
        }
        const newUser = Utils_1.ProxyHelper.UserProxy.add(data.groupName, {
            name: data.name,
            apiKey: data.apiKey,
            apiSecret: data.apiSecret
        });
        if (newUser) {
            return Utils_1.apiSuccess({
                id: newUser.id,
                groupName: newUser.groupName,
                name: newUser.name,
                apiKey: newUser.apiKey,
                apiSecret: newUser.apiSecret
            });
        }
        return Utils_1.apiFailure(`Maybe user with name(${data.name}) and group(${data.groupName}) exists`);
    });
}
function update(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateUpdateUser(data);
        if (validation !== undefined) {
            return Utils_1.apiFailure(validation);
        }
        const updateUser = Utils_1.ProxyHelper.UserProxy.update(data.userId, {
            groupName: data.options.groupName,
            name: data.options.name,
            apiKey: data.options.apiKey,
            apiSecret: data.options.apiSecret
        });
        if (updateUser) {
            return Utils_1.apiSuccess({
                id: updateUser.id,
                groupName: updateUser.groupName,
                name: updateUser.name,
                apiKey: updateUser.apiKey,
                apiSecret: updateUser.apiSecret
            });
        }
        return Utils_1.apiFailure(`Maybe user with userId(${data.userId}) not exists`);
    });
}
function remove(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateRemoveUser(data);
        if (validation !== undefined) {
            return Utils_1.apiSuccess(validation);
        }
        const removeUser = Utils_1.ProxyHelper.UserProxy.remove(data.userId);
        if (removeUser) {
            return Utils_1.apiSuccess({
                id: removeUser.id,
                groupName: removeUser.groupName,
                name: removeUser.name,
                apiKey: removeUser.apiKey,
                apiSecret: removeUser.apiSecret
            });
        }
        return Utils_1.apiFailure(`Maybe user with userId(${data.userId}) not exists`);
    });
}
exports.default = {
    getAll,
    get,
    add,
    remove,
    update
};
