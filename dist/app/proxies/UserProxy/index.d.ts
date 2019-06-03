import Proxy from "../../../patterns/proxy/Proxy";
import { MaybeUndefined } from "../../../base/Common";
import { Account, UpdateAccount } from "../../Types";
declare class UserProxy extends Proxy {
    static readonly NAME: string;
    private userMap;
    private dbHelper;
    constructor();
    onRegister(): void;
    readonly AllAccounts: Account[];
    add(groupName: string, account: Account): MaybeUndefined<Account>;
    remove(userId: string): MaybeUndefined<Account>;
    update(userId: string, updateData: UpdateAccount): MaybeUndefined<Account>;
    get(userId: string): MaybeUndefined<Account>;
    private isUserExists;
    private isUserInGroup;
    private isNameInGroup;
}
export default UserProxy;
