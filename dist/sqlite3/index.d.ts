import Sqlite3 = require("better-sqlite3");
declare class Database {
    private static _instance?;
    static getInstance(): Database;
    private _sqlite3Handler;
    private constructor();
    readonly Sqlite3Handler: Sqlite3.Database;
    private initOKExDatabase;
}
export default Database;
