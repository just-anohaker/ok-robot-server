import uuid from "uuid";
import Sqlite3 = require("better-sqlite3");

import Database from "../../../sqlite3";
import Proxy from "../../../patterns/proxy/Proxy";
import { MaybeUndefined } from "../../../base/Common";
import { Account, UpdateAccount } from "../../Types";

class UserProxy extends Proxy {
    static readonly NAME: string = "PROXY_USER";

    private userMap: Map<string, Account>;

    private dbHelper: _DbHelper;
    constructor() {
        super(UserProxy.NAME);

        this.userMap = new Map<string, Account>();
        this.dbHelper = new _DbHelper(Database.getInstance().Sqlite3Handler);
    }

    onRegister() {
        const dbUsers = this.dbHelper.getAllValidUsers();
        dbUsers.forEach(account => {
            this.userMap.set(account.id!, account);
        });
    }

    get AllAccounts(): Account[] {
        const result: Account[] = [];
        this.userMap.forEach(value => result.push(Object.assign({}, value)));
        return result;
    }

    add(groupName: string, account: Account): MaybeUndefined<Account> {
        if (this.isNameInGroup(account.name, groupName)) {
            return undefined;
        }

        account.groupName = groupName;
        account.id = uuid.v1();
        if (this.dbHelper.add(account)) {
            this.userMap.set(account.id, account);
            return Object.assign({}, account);
        }
        return undefined;
    }

    remove(userId: string): MaybeUndefined<Account> {
        if (!this.isUserExists(userId)) {
            return undefined;
        }
        const removeUser = this.userMap.get(userId)!;
        if (this.dbHelper.remove(userId)) {
            this.userMap.delete(userId);
            return Object.assign({}, removeUser);
        }
        return undefined;
    }

    update(userId: string, updateData: UpdateAccount): MaybeUndefined<Account> {
        if (!this.isUserExists(userId)) {
            return undefined;
        }

        let isChanged = false;
        let needCheckNameOrGroup = false;
        const newAccount = Object.assign({}, this.userMap.get(userId)!);
        if (updateData.name && newAccount.name !== updateData.name) {
            newAccount.name = updateData.name!;
            isChanged = true;
            needCheckNameOrGroup = true;
        }
        if (updateData.httpkey && newAccount.httpkey !== updateData.httpkey) {
            newAccount.httpkey = updateData.httpkey;
            isChanged = true;
        }
        if (updateData.httpsecret && newAccount.httpsecret !== updateData.httpsecret) {
            newAccount.httpsecret = updateData.httpsecret;
            isChanged = true;
        }
        if (updateData.passphrase && newAccount.passphrase !== updateData.passphrase) {
            newAccount.passphrase = updateData.passphrase;
            isChanged = true;
        }
        if (updateData.groupName && newAccount.groupName !== updateData.groupName) {
            newAccount.groupName = updateData.groupName;
            isChanged = true;
            needCheckNameOrGroup = true;
        }

        if (needCheckNameOrGroup && this.isNameInGroup(newAccount.name, newAccount.groupName!)) {
            return undefined;
        }

        if (isChanged && this.dbHelper.update(userId, newAccount)) {
            this.userMap.set(userId, newAccount);
            return Object.assign({}, newAccount);
        }

        return undefined;

    }

    get(userId: string): MaybeUndefined<Account> {
        if (!this.isUserExists(userId)) {
            return undefined;
        }

        return this.userMap.get(userId)!
    }

    private isUserExists(userId: string): boolean {
        return this.userMap.has(userId);
    }

    private isUserInGroup(userId: string, groupName: string): boolean {
        let found = false;
        for (let userId of this.userMap.keys()) {
            const user = this.userMap.get(userId)!;
            if (user.groupName === groupName && user.id === userId) {
                found = true;
                break;
            }
        }
        return found;
    }

    private isNameInGroup(userName: string, groupName: string): boolean {
        let found = false;
        for (let userId of this.userMap.keys()) {
            const user = this.userMap.get(userId)!;
            if (user.groupName === groupName && user.name === userName) {
                found = true;
                break;
            }
        }
        return found;
    }
}

// /> helpers
class _DbHelper {
    constructor(private handler: Sqlite3.Database) { }

    getAllUsers(): Account[] {
        const result: Account[] = [];
        try {
            const stmt = this.handler.prepare("select * from users;");
            const queryResults = stmt.all();
            for (let item of queryResults) {
                result.push(this.convIAccount(item));
            }
        } catch (error) {
            console.log("[DbHelper.getAllUsers] ", error);
        }
        return result;
    }

    getAllValidUsers(): Account[] {
        const result: Account[] = [];
        try {
            const stmt = this.handler.prepare("select * from users where state=$state;");
            const queryResults = stmt.all({ state: 1 });
            for (let item of queryResults) {
                result.push(this.convIAccount(item));
            }
        } catch (error) {
            // TODO
            console.log("[DbHelper.getAllValidUsers] ", error);
        }
        return result;
    }

    getAllInvalidUsers(): Account[] {
        const result: Account[] = [];
        try {
            const stmt = this.handler.prepare("select * from users where state=$state;");
            const queryResults = stmt.all({ state: 0 });
            for (let item of queryResults) {
                result.push(this.convIAccount(item));
            }
        } catch (error) {
            // TODO
            console.log("[DbHelper.getAllInvalidUsers] ", error);
        }
        return result;
    }

    update(userId: string, options: UpdateAccount): boolean {
        let success = true;
        try {
            const stmt = this.handler.prepare("update users set " +
                "groupName=$groupName, name=$name, httpKey=$httpKey, httpSecret=$httpSecret, passphrase=$passphrase " +
                "where id=$userId and state=$state;"
            );
            const runResult: Sqlite3.RunResult = stmt.run({
                groupName: options.groupName!,
                name: options.name!,
                httpKey: options.httpkey!,
                httpSecret: options.httpsecret!,
                passphrase: options.passphrase!,
                userId: userId,
                state: 1
            });
            if (runResult.changes <= 0) {
                success = false;
            }
        } catch (error) {
            success = false;
            console.log("[DbHelper.update] ", error);
        }
        return success;
    }

    remove(userId: string): boolean {
        let success = true;
        try {
            const stmt = this.handler.prepare("update users set state=$state where id=$userId;");
            const runResult = stmt.run({ state: 0, userId });
            if (runResult.changes <= 0) {
                success = false;
            }
        } catch (error) {
            success = false;
            console.log("[DbHelper.remove] ", error);
        }
        return success;
    }

    add(newUser: Account): boolean {
        let success = true;
        try {
            const stmt = this.handler.prepare("insert into users (id, groupName, name, httpKey, httpSecret, passphrase, state) " +
                "values($userId, $groupName, $name, $httpKey, $httpSecret, $passphrase, $state);");
            const runResult = stmt.run({
                userId: newUser.id!,
                groupName: newUser.groupName!,
                name: newUser.name,
                httpKey: newUser.httpkey,
                httpSecret: newUser.httpsecret,
                passphrase: newUser.passphrase,
                state: 1
            });
            if (runResult.changes <= 0) {
                success = false;
            }
        } catch (error) {
            success = false;
            console.log("[DbHelper.add] ", error);
        }
        return success;
    }

    private convIAccount(data: any): Account {
        return {
            id: data.id as string,
            groupName: data.groupName as string,
            name: data.name as string,
            httpkey: data.httpKey as string,
            httpsecret: data.httpSecret as string,
            passphrase: data.passphrase as string
        };
    }
}

export default UserProxy;