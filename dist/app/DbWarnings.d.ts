import Sqlite3 = require("better-sqlite3");
import { Warning } from "./Types";
export declare class DbWarnings {
    private handler;
    constructor(handler: Sqlite3.Database);
    getWarnings(sql: any, params: any): any;
    getWarningsByWid(id: any): any;
    update(sql: any, params: any): boolean;
    updateAllInfo(params: any): boolean;
    remove(wid: string): boolean;
    add(newWarning: Warning): boolean;
}
