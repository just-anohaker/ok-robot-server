"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Proxy_1 = __importDefault(require("../../patterns/proxy/Proxy"));
class UserProxy extends Proxy_1.default {
    constructor() {
        super(UserProxy.NAME);
        this.userGroup = [];
        this.userGroupMap = new Map();
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
        this.userGroup.forEach(value => results.push(Object.assign({}, value)));
        return results;
    }
    add(groupName, account) {
        if (!this.hasGroup(groupName)) {
            const group = { name: groupName, accounts: [account] };
            this.userGroup.push(group);
            this.userGroupMap.set(groupName, group);
            return true;
        }
        const group = this.userGroupMap.get(groupName);
        if (group.accounts.some(value => value.name === account.name)) {
            return false;
        }
        group.accounts.push(account);
        return true;
    }
    remove(groupName, accountName) {
        if (!this.hasGroup(groupName)) {
            return false;
        }
        const group = this.userGroupMap.get(groupName);
        const findIdx = group.accounts.findIndex(value => value.name === accountName);
        if (findIdx === -1) {
            return false;
        }
        group.accounts.splice(findIdx, 1);
        if (group.accounts.length === 0) {
            this.userGroup.splice(this.userGroup.findIndex(value => value.name === groupName), 1);
            this.userGroupMap.delete(groupName);
        }
        return true;
    }
    update(oldGroup, newGroup) {
        if (!this.hasGroup(oldGroup.name)) {
            return false;
        }
        let success = true;
        oldGroup.accounts.forEach(account => {
            success = !success || this.remove(oldGroup.name, account.name);
        });
        newGroup.accounts.forEach(account => {
            success = !success || this.add(newGroup.name, account);
        });
        return success;
    }
    query(accountName, groupName) {
        let queryResult = [];
        let queryGroups = this.userGroup;
        if (groupName != null) {
            if (!this.hasGroup(groupName)) {
                return queryResult;
            }
            queryGroups = [this.userGroupMap.get(groupName)];
        }
        queryGroups.forEach(group => {
            group.accounts.forEach(account => {
                if (account.name === accountName) {
                    queryResult.push({ name: group.name, accounts: [Object.assign({}, account)] });
                }
            });
        });
        return queryResult;
    }
    hasGroup(groupName) {
        return this.userGroupMap.has(groupName);
    }
}
UserProxy.NAME = "PROXY_USER";
exports.default = UserProxy;
