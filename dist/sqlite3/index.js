"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const Sqlite3 = require("better-sqlite3");
const Platform_1 = __importDefault(require("../base/Platform"));
const tables_1 = require("./tables");
class Database {
    static getInstance() {
        if (Database._instance === undefined) {
            Database._instance = new Database();
        }
        return Database._instance;
    }
    constructor() {
        const userdataDir = Platform_1.default.getInstance().getUserDataDir();
        const databaseDir = path.join(userdataDir, "databases");
        if (!fs.existsSync(databaseDir)) {
            fs.mkdirSync(databaseDir);
        }
        const dbFilePath = path.join(databaseDir, "sqlite.db");
        console.log(`[Database] create sqlite3 database @(${dbFilePath})`);
        this._sqlite3Handler = new Sqlite3(dbFilePath, { verbose: undefined });
        this.initOKExDatabase();
    }
    get Sqlite3Handler() {
        return this._sqlite3Handler;
    }
    initOKExDatabase() {
        this._sqlite3Handler.transaction(() => {
            tables_1.sqlTables.forEach(table => {
                const stmt = this._sqlite3Handler.prepare(table);
                stmt.run();
            });
            tables_1.sqlAfterTables.forEach(sql => {
                const stmt = this._sqlite3Handler.prepare(sql);
                stmt.run();
            });
        })();
    }
}
exports.default = Database;
