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
declare class UserProxy extends Proxy {
    static readonly NAME: string;
    private userMap;
    constructor();
    readonly AllAccounts: IAccount[];
    add(groupName: string, account: IAccount): MaybeUndefined<IAccount>;
    remove(userId: string): MaybeUndefined<IAccount>;
    update(userId: string, updateData: IUpdateAccount): MaybeUndefined<IAccount>;
    get(userId: string): MaybeUndefined<IAccount>;
    private isUserExists;
    private isUserInGroup;
    private isNameInGroup;
}
export default UserProxy;
