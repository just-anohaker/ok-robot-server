"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Proxy_1 = __importDefault(require("../../patterns/proxy/Proxy"));
var UserProxy = /** @class */ (function (_super) {
    __extends(UserProxy, _super);
    function UserProxy() {
        var _this = _super.call(this, UserProxy.NAME) || this;
        _this.userGroup = [];
        _this.userGroupMap = new Map();
        return _this;
    }
    Object.defineProperty(UserProxy.prototype, "GroupNames", {
        get: function () {
            var names = [];
            this.userGroup.forEach(function (value) { return names.push(value.name); });
            return names;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserProxy.prototype, "AccountNames", {
        get: function () {
            var accountNames = [];
            this.userGroup.forEach(function (value) {
                value.accounts.forEach(function (val) { return accountNames.push(val.name); });
            });
            return accountNames;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserProxy.prototype, "Groups", {
        get: function () {
            var results = [];
            this.userGroup.forEach(function (value) { return results.push(Object.assign({}, value)); });
            return results;
        },
        enumerable: true,
        configurable: true
    });
    UserProxy.prototype.add = function (groupName, account) {
        if (!this.hasGroup(groupName)) {
            var group_1 = { name: groupName, accounts: [account] };
            this.userGroup.push(group_1);
            this.userGroupMap.set(groupName, group_1);
            return true;
        }
        var group = this.userGroupMap.get(groupName);
        if (group.accounts.some(function (value) { return value.name === account.name; })) {
            return false;
        }
        group.accounts.push(account);
        return true;
    };
    UserProxy.prototype.remove = function (groupName, accountName) {
        if (!this.hasGroup(groupName)) {
            return false;
        }
        var group = this.userGroupMap.get(groupName);
        var findIdx = group.accounts.findIndex(function (value) { return value.name === accountName; });
        if (findIdx === -1) {
            return false;
        }
        group.accounts.splice(findIdx, 1);
        if (group.accounts.length === 0) {
            this.userGroup.splice(this.userGroup.findIndex(function (value) { return value.name === groupName; }), 1);
            this.userGroupMap.delete(groupName);
        }
        return true;
    };
    UserProxy.prototype.update = function (oldGroup, newGroup) {
        var _this = this;
        if (!this.hasGroup(oldGroup.name)) {
            return false;
        }
        var success = true;
        oldGroup.accounts.forEach(function (account) {
            success = !success || _this.remove(oldGroup.name, account.name);
        });
        newGroup.accounts.forEach(function (account) {
            success = !success || _this.add(newGroup.name, account);
        });
        return success;
    };
    UserProxy.prototype.query = function (accountName, groupName) {
        var queryResult = [];
        var queryGroups = this.userGroup;
        if (groupName != null) {
            if (!this.hasGroup(groupName)) {
                return queryResult;
            }
            queryGroups = [this.userGroupMap.get(groupName)];
        }
        queryGroups.forEach(function (group) {
            group.accounts.forEach(function (account) {
                if (account.name === accountName) {
                    queryResult.push({ name: group.name, accounts: [Object.assign({}, account)] });
                }
            });
        });
        return queryResult;
    };
    UserProxy.prototype.hasGroup = function (groupName) {
        return this.userGroupMap.has(groupName);
    };
    UserProxy.NAME = "PROXY_USER";
    return UserProxy;
}(Proxy_1.default));
exports.default = UserProxy;
