import Sqlite3 = require("better-sqlite3");
import { IAccount, IUpdateAccount } from "./Common";
declare class DbHelper {
    private handler;
    constructor(handler: Sqlite3.Database);
    getAllUsers(): IAccount[];
    getAllValidUsers(): IAccount[];
    getAllInvalidUsers(): IAccount[];
    update(userId: string, options: IUpdateAccount): boolean;
    remove(userId: string): boolean;
    add(newUser: IAccount): boolean;
    private convIAccount;
}
export default DbHelper;
