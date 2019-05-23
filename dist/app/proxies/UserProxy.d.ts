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
declare class UserProxy extends Proxy {
    static readonly NAME: string;
    private userGroup;
    private userMap;
    constructor();
    readonly GroupNames: string[];
    readonly AccountNames: string[];
    readonly Groups: IGroup[];
    add(groupName: string, account: IAccount): MaybeUndefined<IAccount>;
    remove(userId: string): MaybeUndefined<IAccount>;
    update(userId: string, updateData: IUpdateAccount): MaybeUndefined<IAccount>;
    get(userId: string): MaybeUndefined<IAccount>;
    query(accountName: string, groupName?: string): IAccount[];
    private insertAccount;
    private hasGroup;
    private getGroup;
    private deleteUserInGroup;
    private hasUser;
}
export default UserProxy;
