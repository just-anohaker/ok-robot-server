import Sqlite3 = require("better-sqlite3");
import { IAccount, IUpdateAccount } from "./Common";

class DbHelper {
    constructor(private handler: Sqlite3.Database) { }

    getAllUsers(): IAccount[] {
        const result: IAccount[] = [];
        try {
            const stmt = this.handler.prepare("SELECT * FROM users;");
            const iter = stmt.iterate();
            for (let item of iter) {
                result.push(this.convIAccount(item));
            }
        } catch (error) {
            console.log("[DbHelper.getAllUsers] ", error);
        }

        return result;
    }

    getAllValidUsers(): IAccount[] {
        const result: IAccount[] = [];
        try {
            const stmt = this.handler.prepare("SELECT * FROM users WHERE state=1;");
            const iter = stmt.iterate();
            for (let item of iter) {
                result.push(this.convIAccount(item));
            }
        } catch (error) {
            // TODO
            console.log("[DbHelper.getAllValidUsers] ", error);
        }
        return result;
    }

    getAllInvalidUsers(): IAccount[] {
        const result: IAccount[] = [];
        try {
            const stmt = this.handler.prepare("SELECT * FROM users WHERE state=0;");
            const iter = stmt.iterate();
            for (let item of iter) {
                result.push(this.convIAccount(item));
            }
        } catch (error) {
            // TODO
            console.log("[DbHelper.getAllInvalidUsers] ", error);
        }
        return result;
    }

    update(userId: string, options: IUpdateAccount): boolean {
        console.log("userId:", userId, "options:", options);
        let success = true;
        try {
            const stmt = this.handler.prepare("UPDATE users SET " +
                `groupName="${options.groupName!}", ` +
                `name="${options.name!}", ` +
                `apiKey="${options.apiKey!}", ` +
                `apiSecret="${options.apiSecret!}" ` +
                `WHERE id="${userId}" AND state=1;`);
            const runResult: Sqlite3.RunResult = stmt.run();
            if (runResult.changes <= 0) {
                success = false;
            }
        } catch (error) {
            success = false;
            console.log("[DbHelper.update] ", error);
        }

        return success;
    }

    remove(userId: string): boolean {
        let success = true;
        try {
            const stmt = this.handler.prepare(`UPDATE users SET state=0 WHERE id="${userId}";`);
            const runResult = stmt.run();
            if (runResult.changes <= 0) {
                success = false;
            }
        } catch (error) {
            success = false;
            console.log("[DbHelper.remove] ", error);
        }
        return success;
    }

    add(newUser: IAccount): boolean {
        let success = true;
        try {
            const stmt = this.handler.prepare("INSERT INTO users (id, groupName, name, apiKey, apiSecret, state) " +
                `VALUES("${newUser.id!}", "${newUser.groupName!}", "${newUser.name}", "${newUser.apiKey}", "${newUser.apiSecret}", 1);`);
            const runResult = stmt.run();
            if (runResult.changes <= 0) {
                success = false;
            }
        } catch (error) {
            success = false;
            console.log("[DbHelper.add] ", error);
        }
        return success;
    }

    private convIAccount(data: any): IAccount {
        return {
            id: data.id as string,
            groupName: data.groupName as string,
            name: data.name as string,
            apiKey: data.apiKey as string,
            apiSecret: data.apiSecret as string
        };
    }
}

export default DbHelper;