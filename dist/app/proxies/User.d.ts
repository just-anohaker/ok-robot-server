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
declare class UserProxy extends Proxy {
    static readonly NAME: string;
    private userGroup;
    private userGroupMap;
    constructor();
    readonly GroupNames: string[];
    readonly AccountNames: string[];
    readonly Groups: IGroup[];
    add(groupName: string, account: IAccount): boolean;
    remove(groupName: string, accountName: string): boolean;
    update(oldGroup: IGroup, newGroup: IGroup): boolean;
    query(accountName: string, groupName?: string): IGroup[];
    private hasGroup;
}
export default UserProxy;
