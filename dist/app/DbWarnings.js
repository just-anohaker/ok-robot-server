"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DbWarnings {
    constructor(handler) {
        this.handler = handler;
    }
    getWarnings(sql, params) {
        let result;
        try {
            const stmt = this.handler.prepare(sql);
            result = stmt.all(params || []);
        }
        catch (error) {
            console.log("[getWarnings] ", error);
        }
        return result;
    }
    getWarningsByWid(id) {
        let result;
        let sql = 'select * from Warnings where wid = $wid and acct_key = $acct_key;';
        try {
            const stmt = this.handler.prepare(sql);
            result = stmt.all({ wid: id } || []);
        }
        catch (error) {
            console.log("[getWarningsByWid] ", error);
        }
        return result;
    }
    update(sql, params) {
        let success = true;
        try {
            const stmt = this.handler.prepare(sql);
            const runResult = stmt.run(params);
            if (runResult.changes <= 0) {
                success = false;
            }
        }
        catch (error) {
            success = false;
            console.log("[DbWarnings.update] ", error);
        }
        return success;
    }
    updateAllInfo(params) {
        let success = true;
        try {
            let sql = `UPDATE warnings
            SET wid = $wid,
                acct_key = $acct_key,
                instrument_id = $instrument_id,
                filepath = $filepath,
                maxprice = $maxprice,
                minprice = $minprice,
                utime = $utime,
                pecent = $pecent,
                status = $status,
                timestamp = $timestamp,
                type = $type
          WHERE  wid = $wid and acct_key = $acct_key`;
            const stmt = this.handler.prepare(sql);
            const runResult = stmt.run(params);
            if (runResult.changes <= 0) {
                success = false;
            }
        }
        catch (error) {
            success = false;
            console.log("[DbWarnings.update] ", error);
        }
        return success;
    }
    remove(wid) {
        let success = true;
        try {
            const stmt = this.handler.prepare("DELETE FROM warnings WHERE wid = $wid ;");
            const runResult = stmt.run({ wid });
            if (runResult.changes <= 0) {
                success = false;
            }
        }
        catch (error) {
            success = false;
            console.log("[DbWarnings.remove] ", error);
        }
        return success;
    }
    add(newWarning) {
        let success = true;
        try {
            const stmt = this.handler.prepare(`INSERT INTO warnings (
                    wid,
                    acct_key,
                    instrument_id,
                    filepath,
                    maxprice,
                    minprice,
                    utime,
                    pecent,
                    status,
                    timestamp,
                    type
                )
                VALUES (
                    $wid,
                    $acct_key,
                    $instrument_id,
                    $filepath,
                    $maxprice,
                    $minprice,
                    $utime,
                    $pecent,
                    $status,
                    $timestamp,
                    $type
                );`);
            const runResult = stmt.run(newWarning);
            if (runResult.changes <= 0) {
                success = false;
            }
        }
        catch (error) {
            success = false;
            console.log("[addwarnings] ", error);
        }
        return success;
    }
}
exports.DbWarnings = DbWarnings;
