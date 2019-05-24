"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = __importDefault(require("uuid"));
const Proxy_1 = __importDefault(require("../../patterns/proxy/Proxy"));
const sqlite3_1 = __importDefault(require("../../sqlite3"));
const DbHelper_1 = __importDefault(require("./DbHelper"));
class UserProxy extends Proxy_1.default {
    constructor() {
        super(UserProxy.NAME);
        this.userMap = new Map();
        this.dbHelper = new DbHelper_1.default(sqlite3_1.default.getInstance().Sqlite3Handler);
    }
    onRegister() {
        const dbUsers = this.dbHelper.getAllValidUsers();
        dbUsers.forEach(account => {
            this.userMap.set(account.id, account);
        });
    }
    get AllAccounts() {
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
        if (this.dbHelper.add(account)) {
            this.userMap.set(account.id, account);
            return Object.assign({}, account);
        }
        return undefined;
    }
    remove(userId) {
        if (!this.isUserExists(userId)) {
            return undefined;
        }
        const removeUser = this.userMap.get(userId);
        if (this.dbHelper.remove(userId)) {
            this.userMap.delete(userId);
            return Object.assign({}, removeUser);
        }
        return undefined;
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
        if (changed && this.dbHelper.update(userId, newAccount)) {
            this.userMap.set(userId, newAccount);
            return Object.assign({}, newAccount);
        }
        return undefined;
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
