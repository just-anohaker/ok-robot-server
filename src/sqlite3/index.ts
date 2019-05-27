import * as path from "path";

import Sqlite3 = require("better-sqlite3");
import Platform from "../base/Platform";
import { sqlTables, sqlAfterTables } from "./tables";

class Database {
    private static _instance?: Database;

    static getInstance(): Database {
        if (Database._instance === undefined) {
            Database._instance = new Database();
        }

        return Database._instance;
    }

    private _sqlite3Handler: Sqlite3.Database;

    private constructor() {
        const userdataDir = Platform.getInstance().getUserDataDir();
        const dbFilePath = path.join(userdataDir, "okex.sqlite");
        console.log(`[Database] create sqlite3 database @(${dbFilePath})`);
        this._sqlite3Handler = new Sqlite3(dbFilePath, { verbose: undefined });

        this.initOKExDatabase();
    }

    get Sqlite3Handler(): Sqlite3.Database {
        return this._sqlite3Handler;
    }

    private initOKExDatabase() {
        this._sqlite3Handler.transaction(() => {
            sqlTables.forEach(table => {
                const stmt = this._sqlite3Handler.prepare(table);
                stmt.run();
            });
            sqlAfterTables.forEach(sql => {
                const stmt = this._sqlite3Handler.prepare(sql);
                stmt.run();
            });
        })();
    }
}

export default Database;

