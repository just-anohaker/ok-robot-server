import Proxy from "../../patterns/proxy/Proxy";

export interface IAccount {
    name: string;
    apiKey: string;
    apiSecret: string;
}

export interface IGroup {
    name: string;
    accounts: IAccount[];
}

class UserProxy extends Proxy {
    static readonly NAME: string = "PROXY_USER";

    private userGroup: IGroup[];
    private userGroupMap: Map<string, IGroup>

    constructor() {
        super(UserProxy.NAME);

        this.userGroup = [];
        this.userGroupMap = new Map<string, IGroup>();
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
        this.userGroup.forEach(value => results.push(Object.assign({}, value)));
        return results;
    }

    addAccount(groupName: string, account: IAccount): boolean {
        if (!this.hasGroup(groupName)) {
            const group: IGroup = { name: groupName, accounts: [account] };
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

    removeAccount(groupName: string, accountName: string): boolean {
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

    // updateAccount(groupName: string, account: IAccount): boolean {
    //     if (!this.hasGroup(groupName)) {
    //         return false;
    //     }

    //     const group = this.userGroupMap.get(groupName);
    //     const findIdx = group.accounts.findIndex(value => value.name === account.name);
    //     if (findIdx === -1) {
    //         return false;
    //     }
    //     group.accounts.splice(findIdx, 1);
    //     group.accounts.push(account);
    //     return true;
    // }

    queryAccount(accountName: string): IGroup[] {
        let results: IGroup[] = [];
        this.userGroup.forEach(value => {
            value.accounts.forEach(val => {
                if (val.name === accountName) {
                    results.push({ name: value.name, accounts: [Object.assign({}, val)] });
                }
            })
        });
        return results;
    }

    queryAccountInGroup(groupName: string, accountName: string): IGroup | undefined {
        if (!this.hasGroup(groupName)) {
            return undefined;
        }

        const group = this.userGroupMap.get(groupName);
        let result: IGroup = { name: group.name, accounts: [] };
        group.accounts.forEach(value => {
            if (value.name === accountName) {
                result.accounts.push(Object.assign({}, value));
            }
        });

        return result;
    }

    private hasGroup(groupName: string): boolean {
        return this.userGroupMap.has(groupName);
    }
}

export default UserProxy;