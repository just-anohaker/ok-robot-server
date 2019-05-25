import Proxy from "../../patterns/proxy/Proxy";
import { MaybeUndefined } from "../../base/Common";
import { IAccount, IUpdateAccount } from "../Types";
declare class UserProxy extends Proxy {
    static readonly NAME: string;
    private userMap;
    private dbHelper;
    constructor();
    onRegister(): void;
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
