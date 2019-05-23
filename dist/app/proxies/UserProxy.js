"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = __importDefault(require("uuid"));
const Proxy_1 = __importDefault(require("../../patterns/proxy/Proxy"));
class UserProxy extends Proxy_1.default {
    constructor() {
        super(UserProxy.NAME);
        this.userMap = new Map();
    }
    get AllAccounts() {
        // const userIds: string[] = [];
        // for (let id of this.userMap.keys()) {
        //     userIds.push(id);
        // }
        // userIds.sort((a: string, b: string): number => {
        //     return a > b ? 1 : (a < b ? -1 : 0);
        // });
        // const result: IAccount[] = [];
        // for (let userId of userIds) {
        //     result.push(Object.assign({}, this.userMap.get(userId)!));
        // }
        // return result;
        const result = [];
        this.userMap.forEach(value => result.push(Object.assign({}, value)));
        return result;
    }
    add(groupName, account) {
        if (this.isNameInGroup(account.name, groupName)) {
            return undefined;
        }
        account.groupName = groupName;
        account.id = uuid_1.default.v1();
        this.userMap.set(account.id, account);
        return Object.assign({}, account);
    }
    remove(userId) {
        if (!this.isUserExists(userId)) {
            return undefined;
        }
        const removeUser = this.userMap.get(userId);
        this.userMap.delete(userId);
        return Object.assign({}, removeUser);
    }
    update(userId, updateData) {
        if (!this.isUserExists(userId)) {
            return undefined;
        }
        let changed = false;
        const newAccount = Object.assign({}, this.userMap.get(userId));
        if (updateData.name && newAccount.name !== updateData.name) {
            newAccount.name = updateData.name;
            changed = true;
        }
        if (updateData.apiKey && newAccount.apiKey !== updateData.apiKey) {
            newAccount.apiKey = updateData.apiKey;
            changed = true;
        }
        if (updateData.apiSecret && newAccount.apiSecret !== updateData.apiSecret) {
            newAccount.apiSecret = updateData.apiSecret;
            changed = true;
        }
        if (updateData.groupName && newAccount.groupName !== updateData.groupName) {
            if (this.isNameInGroup(newAccount.name, updateData.groupName)) {
                return undefined;
            }
            newAccount.groupName = updateData.groupName;
            changed = true;
        }
        if (changed) {
            this.userMap.set(userId, newAccount);
        }
        return Object.assign({}, newAccount);
    }
    get(userId) {
        if (!this.isUserExists(userId)) {
            return undefined;
        }
        return this.userMap.get(userId);
    }
    isUserExists(userId) {
        return this.userMap.has(userId);
    }
    isUserInGroup(userId, groupName) {
        let found = false;
        for (let userId of this.userMap.keys()) {
            const user = this.userMap.get(userId);
            if (user.groupName === groupName && user.id === userId) {
                found = true;
                break;
            }
        }
        return found;
    }
    isNameInGroup(userName, groupName) {
        let found = false;
        for (let userId of this.userMap.keys()) {
            const user = this.userMap.get(userId);
            if (user.groupName === groupName && user.name === userName) {
                found = true;
                break;
            }
        }
        return found;
    }
}
UserProxy.NAME = "PROXY_USER";
exports.default = UserProxy;
