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

export interface IGroup {
    name: string;
    accounts: IAccount[];
}

export interface IUpdateAccount {
    id?: string;
    groupName?: string;
    name?: string;
    apiKey?: string;
    apiSecret?: string;
}

export interface IQueryOptions {
    name?: string;
    apiKey?: string;
    apiSecret?: string;
}

class UserProxy extends Proxy {
    static readonly NAME: string = "PROXY_USER";

    private userGroup: IGroup[];
    private userMap: Map<string, IAccount>;

    constructor() {
        super(UserProxy.NAME);

        this.userGroup = [];
        this.userMap = new Map<string, IAccount>();
    }

    get GroupNames(): string[] {
        const names: string[] = [];
        this.userGroup.forEach(value => names.push(value.name));
        return names;
    }

    get AccountNames(): string[] {
        const accountNames: string[] = [];
        this.userGroup.forEach(value => {
            value.accounts.forEach(val => accountNames.push(val.name));
        });
        return accountNames;
    }

    get Groups(): IGroup[] {
        const results: IGroup[] = [];
        // console.log("groups:", JSON.stringify(this.userGroup));
        this.userGroup.forEach(value => results.push(Object.assign({}, value)));
        return results;
    }

    add(groupName: string, account: IAccount): MaybeUndefined<IAccount> {
        const group = this.getGroup(groupName, true)!;
        if (group.accounts.some(value => value.name === account.name)) {
            return undefined;
        }
        account.groupName = groupName;
        account.id = uuid.v1();
        group.accounts.push(account);
        this.insertAccount(account);
        return Object.assign({}, account);
    }

    remove(userId: string): MaybeUndefined<IAccount> {
        if (!this.hasUser(userId)) {
            return undefined;
        }

        const account = this.userMap.get(userId)!;
        this.userMap.delete(userId);
        this.deleteUserInGroup(userId, account.groupName!);

        return Object.assign({}, account);
    }

    update(userId: string, updateData: IUpdateAccount): MaybeUndefined<IAccount> {
        if (!this.hasUser(userId)) {
            return undefined;
        }

        const account = this.userMap.get(userId)!;
        const newAccount = Object.assign({}, account);
        if (updateData.name && newAccount.name !== updateData.name) {
            newAccount.name = updateData.name!;
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
            const newGroup = this.getGroup(updateData.groupName!, true)!;
            if (newGroup.accounts.some(value => value.name === newAccount.name)) {
                return undefined;
            }
            this.deleteUserInGroup(userId, account.groupName!);
            newGroup.accounts.push(newAccount);
            this.userMap.set(newAccount.id!, newAccount);
        }

        return Object.assign({}, newAccount);
    }

    get(userId: string): MaybeUndefined<IAccount> {
        if (!this.hasUser(userId)) {
            return undefined;
        }
        return this.userMap.get(userId)!;
    }

    query(accountName: string, groupName?: string): IAccount[] {
        let queryResult: IAccount[] = [];
        let queryGroups: IGroup[] = this.userGroup;
        if (groupName != null) {
            if (!this.hasGroup(groupName!)) {
                return queryResult;
            }

            queryGroups = [this.getGroup(groupName!)!]
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

    private insertAccount(account: IAccount): void {
        this.userMap.set(account.id!, account);
    }

    private hasGroup(groupName: string): boolean {
        return this.userGroup.some(group => group.name === groupName);
    }

    private getGroup(groupName: string, build: boolean = false): MaybeUndefined<IGroup> {
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

    private deleteUserInGroup(userId: string, groupName: string): boolean {
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

    private hasUser(userId: string): boolean {
        return this.userMap.has(userId);
    }
}

export default UserProxy;