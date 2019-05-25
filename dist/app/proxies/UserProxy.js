"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = __importDefault(require("uuid"));
const sqlite3_1 = __importDefault(require("../../sqlite3"));
const Proxy_1 = __importDefault(require("../../patterns/proxy/Proxy"));
class UserProxy extends Proxy_1.default {
    constructor() {
        super(UserProxy.NAME);
        this.userMap = new Map();
        this.dbHelper = new _DbHelper(sqlite3_1.default.getInstance().Sqlite3Handler);
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
// /> helpers
class _DbHelper {
    constructor(handler) {
        this.handler = handler;
    }
    getAllUsers() {
        const result = [];
        try {
            const stmt = this.handler.prepare("SELECT * FROM users;");
            const iter = stmt.iterate();
            for (let item of iter) {
                result.push(this.convIAccount(item));
            }
        }
        catch (error) {
            console.log("[DbHelper.getAllUsers] ", error);
        }
        return result;
    }
    getAllValidUsers() {
        const result = [];
        try {
            const stmt = this.handler.prepare("SELECT * FROM users WHERE state=1;");
            const iter = stmt.iterate();
            for (let item of iter) {
                result.push(this.convIAccount(item));
            }
        }
        catch (error) {
            // TODO
            console.log("[DbHelper.getAllValidUsers] ", error);
        }
        return result;
    }
    getAllInvalidUsers() {
        const result = [];
        try {
            const stmt = this.handler.prepare("SELECT * FROM users WHERE state=0;");
            const iter = stmt.iterate();
            for (let item of iter) {
                result.push(this.convIAccount(item));
            }
        }
        catch (error) {
            // TODO
            console.log("[DbHelper.getAllInvalidUsers] ", error);
        }
        return result;
    }
    update(userId, options) {
        console.log("userId:", userId, "options:", options);
        let success = true;
        try {
            const stmt = this.handler.prepare("UPDATE users SET " +
                `groupName="${options.groupName}", ` +
                `name="${options.name}", ` +
                `apiKey="${options.apiKey}", ` +
                `apiSecret="${options.apiSecret}" ` +
                `WHERE id="${userId}" AND state=1;`);
            const runResult = stmt.run();
            if (runResult.changes <= 0) {
                success = false;
            }
        }
        catch (error) {
            success = false;
            console.log("[DbHelper.update] ", error);
        }
        return success;
    }
    remove(userId) {
        let success = true;
        try {
            const stmt = this.handler.prepare(`UPDATE users SET state=0 WHERE id="${userId}";`);
            const runResult = stmt.run();
            if (runResult.changes <= 0) {
                success = false;
            }
        }
        catch (error) {
            success = false;
            console.log("[DbHelper.remove] ", error);
        }
        return success;
    }
    add(newUser) {
        let success = true;
        try {
            const stmt = this.handler.prepare("INSERT INTO users (id, groupName, name, apiKey, apiSecret, state) " +
                `VALUES("${newUser.id}", "${newUser.groupName}", "${newUser.name}", "${newUser.apiKey}", "${newUser.apiSecret}", 1);`);
            const runResult = stmt.run();
            if (runResult.changes <= 0) {
                success = false;
            }
        }
        catch (error) {
            success = false;
            console.log("[DbHelper.add] ", error);
        }
        return success;
    }
    convIAccount(data) {
        return {
            id: data.id,
            groupName: data.groupName,
            name: data.name,
            apiKey: data.apiKey,
            apiSecret: data.apiSecret
        };
    }
}
exports.default = UserProxy;
