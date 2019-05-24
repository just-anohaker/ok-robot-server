"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DbHelper {
    constructor(handler) {
        this.handler = handler;
    }
    getAllUsers() {
        const result = [];
        try {
            const stmt = this.handler.prepare("SELECT * FROM users;");
            const iter = stmt.iterate();
            for (let item of iter) {
                result.push(this.convIAccount(item));
            }
        }
        catch (error) {
            console.log("[DbHelper.getAllUsers] ", error);
        }
        return result;
    }
    getAllValidUsers() {
        const result = [];
        try {
            const stmt = this.handler.prepare("SELECT * FROM users WHERE state=1;");
            const iter = stmt.iterate();
            for (let item of iter) {
                result.push(this.convIAccount(item));
            }
        }
        catch (error) {
            // TODO
            console.log("[DbHelper.getAllValidUsers] ", error);
        }
        return result;
    }
    getAllInvalidUsers() {
        const result = [];
        try {
            const stmt = this.handler.prepare("SELECT * FROM users WHERE state=0;");
            const iter = stmt.iterate();
            for (let item of iter) {
                result.push(this.convIAccount(item));
            }
        }
        catch (error) {
            // TODO
            console.log("[DbHelper.getAllInvalidUsers] ", error);
        }
        return result;
    }
    update(userId, options) {
        console.log("userId:", userId, "options:", options);
        let success = true;
        try {
            const stmt = this.handler.prepare("UPDATE users SET " +
                `groupName="${options.groupName}", ` +
                `name="${options.name}", ` +
                `apiKey="${options.apiKey}", ` +
                `apiSecret="${options.apiSecret}" ` +
                `WHERE id="${userId}" AND state=1;`);
            const runResult = stmt.run();
            if (runResult.changes <= 0) {
                success = false;
            }
        }
        catch (error) {
            success = false;
            console.log("[DbHelper.update] ", error);
        }
        return success;
    }
    remove(userId) {
        let success = true;
        try {
            const stmt = this.handler.prepare(`UPDATE users SET state=0 WHERE id="${userId}";`);
            const runResult = stmt.run();
            if (runResult.changes <= 0) {
                success = false;
            }
        }
        catch (error) {
            success = false;
            console.log("[DbHelper.remove] ", error);
        }
        return success;
    }
    add(newUser) {
        let success = true;
        try {
            const stmt = this.handler.prepare("INSERT INTO users (id, groupName, name, apiKey, apiSecret, state) " +
                `VALUES("${newUser.id}", "${newUser.groupName}", "${newUser.name}", "${newUser.apiKey}", "${newUser.apiSecret}", 1);`);
            const runResult = stmt.run();
            if (runResult.changes <= 0) {
                success = false;
            }
        }
        catch (error) {
            success = false;
            console.log("[DbHelper.add] ", error);
        }
        return success;
    }
    convIAccount(data) {
        return {
            id: data.id,
            groupName: data.groupName,
            name: data.name,
            apiKey: data.apiKey,
            apiSecret: data.apiSecret
        };
    }
}
exports.default = DbHelper;
