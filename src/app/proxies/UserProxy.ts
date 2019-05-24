import uuid from "uuid";

import Proxy from "../../patterns/proxy/Proxy";
import { MaybeUndefined } from "../../base/Common";
import { IAccount, IUpdateAccount } from "./Common";
import Database from "../../sqlite3";
import DbHelper from "./DbHelper";

class UserProxy extends Proxy {
    static readonly NAME: string = "PROXY_USER";

    private userMap: Map<string, IAccount>;

    private dbHelper: DbHelper;
    constructor() {
        super(UserProxy.NAME);

        this.userMap = new Map<string, IAccount>();
        this.dbHelper = new DbHelper(Database.getInstance().Sqlite3Handler);
    }

    onRegister() {
        const dbUsers = this.dbHelper.getAllValidUsers();
        dbUsers.forEach(account => {
            this.userMap.set(account.id!, account);
        });
    }

    get AllAccounts(): IAccount[] {
        const result: IAccount[] = [];
        this.userMap.forEach(value => result.push(Object.assign({}, value)));
        return result;
    }

    add(groupName: string, account: IAccount): MaybeUndefined<IAccount> {
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

    remove(userId: string): MaybeUndefined<IAccount> {
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

    update(userId: string, updateData: IUpdateAccount): MaybeUndefined<IAccount> {
        if (!this.isUserExists(userId)) {
            return undefined;
        }

        let changed = false;
        const newAccount = Object.assign({}, this.userMap.get(userId)!);
        if (updateData.name && newAccount.name !== updateData.name) {
            newAccount.name = updateData.name!;
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
            if (this.isNameInGroup(newAccount.name, updateData.groupName!)) {
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

    get(userId: string): MaybeUndefined<IAccount> {
        if (!this.isUserExists(userId)) {
            return undefined;
        }

        return this.userMap.get(userId)!
    }

    private isUserExists(userId: string): boolean {
        return this.userMap.has(userId);
    }

    private isUserInGroup(userId: string, groupName: string): boolean {
        let found: boolean = false;
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
        let found: boolean = false;
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

export default UserProxy;
export { IAccount, IUpdateAccount } from "./Common";