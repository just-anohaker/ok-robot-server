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
        this.userGroup = [];
        this.userMap = new Map();
    }
    get GroupNames() {
        const names = [];
        this.userGroup.forEach(value => names.push(value.name));
        return names;
    }
    get AccountNames() {
        const accountNames = [];
        this.userGroup.forEach(value => {
            value.accounts.forEach(val => accountNames.push(val.name));
        });
        return accountNames;
    }
    get Groups() {
        const results = [];
        // console.log("groups:", JSON.stringify(this.userGroup));
        this.userGroup.forEach(value => results.push(Object.assign({}, value)));
        return results;
    }
    add(groupName, account) {
        const group = this.getGroup(groupName, true);
        if (group.accounts.some(value => value.name === account.name)) {
            return undefined;
        }
        account.groupName = groupName;
        account.id = uuid_1.default.v1();
        group.accounts.push(account);
        this.insertAccount(account);
        return Object.assign({}, account);
    }
    remove(userId) {
        if (!this.hasUser(userId)) {
            return undefined;
        }
        const account = this.userMap.get(userId);
        this.userMap.delete(userId);
        this.deleteUserInGroup(userId, account.groupName);
        return Object.assign({}, account);
    }
    update(userId, updateData) {
        if (!this.hasUser(userId)) {
            return undefined;
        }
        const account = this.userMap.get(userId);
        const newAccount = Object.assign({}, account);
        if (updateData.name && newAccount.name !== updateData.name) {
            newAccount.name = updateData.name;
        }
        if (updateData.apiKey && newAccount.apiKey !== updateData.apiKey) {
            newAccount.apiKey = updateData.apiKey;
        }
        if (updateData.apiSecret && newAccount.apiSecret !== updateData.apiSecret) {
            newAccount.apiSecret = updateData.apiSecret;
        }
        if (updateData.groupName && newAccount.groupName !== updateData.groupName) {
            // change group
            newAccount.groupName = updateData.groupName;
            const newGroup = this.getGroup(updateData.groupName, true);
            if (newGroup.accounts.some(value => value.name === newAccount.name)) {
                return undefined;
            }
            this.deleteUserInGroup(userId, account.groupName);
            newGroup.accounts.push(newAccount);
            this.userMap.set(newAccount.id, newAccount);
        }
        return Object.assign({}, newAccount);
    }
    get(userId) {
        if (!this.hasUser(userId)) {
            return undefined;
        }
        return this.userMap.get(userId);
    }
    query(accountName, groupName) {
        let queryResult = [];
        let queryGroups = this.userGroup;
        if (groupName != null) {
            if (!this.hasGroup(groupName)) {
                return queryResult;
            }
            queryGroups = [this.getGroup(groupName)];
        }
        queryGroups.forEach(group => {
            group.accounts.forEach(account => {
                if (account.name === accountName) {
                    queryResult.push(Object.assign({}, account));
                }
            });
        });
        return queryResult;
    }
    insertAccount(account) {
        this.userMap.set(account.id, account);
    }
    hasGroup(groupName) {
        return this.userGroup.some(group => group.name === groupName);
    }
    getGroup(groupName, build = false) {
        const filter = this.userGroup.filter(group => group.name === groupName);
        if (filter.length <= 0) {
            if (build) {
                const newGroup = { name: groupName, accounts: [] };
                this.userGroup.push(newGroup);
                return newGroup;
            }
            return undefined;
        }
        return filter[0];
    }
    deleteUserInGroup(userId, groupName) {
        const group = this.getGroup(groupName);
        if (group) {
            const findIdx = group.accounts.findIndex(value => value.id === userId);
            if (findIdx === -1) {
                return false;
            }
            group.accounts.splice(findIdx, 1);
            if (group.accounts.length === 0) {
                this.userGroup.splice(this.userGroup.findIndex(value => value.name === group.name), 1);
            }
            return true;
        }
        return false;
    }
    hasUser(userId) {
        return this.userMap.has(userId);
    }
}
UserProxy.NAME = "PROXY_USER";
exports.default = UserProxy;
