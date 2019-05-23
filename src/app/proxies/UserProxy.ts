import uuid from "uuid";

import Proxy from "../../patterns/proxy/Proxy";
import { MaybeUndefined } from "../../base/Common";

export interface IAccount {
    id?: string;
    groupName?: string;
    name: string;
    apiKey: string;
    apiSecret: string;
}

export interface IUpdateAccount {
    groupName?: string;
    name?: string;
    apiKey?: string;
    apiSecret?: string;
}

class UserProxy extends Proxy {
    static readonly NAME: string = "PROXY_USER";

    private userMap: Map<string, IAccount>;

    constructor() {
        super(UserProxy.NAME);

        this.userMap = new Map<string, IAccount>();
    }

    get AllAccounts(): IAccount[] {
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
        this.userMap.set(account.id, account);
        return Object.assign({}, account);
    }

    remove(userId: string): MaybeUndefined<IAccount> {
        if (!this.isUserExists(userId)) {
            return undefined;
        }
        const removeUser = this.userMap.get(userId)!;
        this.userMap.delete(userId);
        return Object.assign({}, removeUser);
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

        if (changed) {
            this.userMap.set(userId, newAccount);
        }

        return Object.assign({}, newAccount);
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