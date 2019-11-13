"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DbOrders {
    constructor(handler, acct) {
        this.handler = handler;
        this.acct = acct;
    }
    getOrders(sql, params) {
        let result;
        try {
            const stmt = this.handler.prepare(sql);
            result = stmt.all(params || []);
        }
        catch (error) {
            console.log("[getOrders] ", error);
        }
        return result;
    }
    getOrderByOrderId(id) {
        let result;
        let sql = 'select * from orders where order_id = $order_id and acct_key = $acct_key;';
        try {
            const stmt = this.handler.prepare(sql);
            result = stmt.all({ order_id: id, acct_key: this.acct.httpkey } || []);
        }
        catch (error) {
            console.log("[getOrders] ", error);
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
            console.log("[DbHelper.update] ", error);
        }
        return success;
    }
    updateAllInfo(params) {
        let success = true;
        try {
            let sql = `update orders set created_at = $created_at,filled_notional= $filled_notional, filled_size = $filled_size
                ,instrument_id = $instrument_id, notional = $notional, order_type = $order_type, price = $price,price_avg = $price_avg
                , product_id = $product_id, side = $side,size = $size, status = $status,state = $state
                , timestamp = $timestamp, type = $type where order_id = $order_id and acct_key = $acct_key`;
            const stmt = this.handler.prepare(sql);
            params.acct_key = this.acct.httpkey;
            const runResult = stmt.run(params);
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
    // remove(userId: string): boolean {
    //     let success = true;
    //     try {
    //         const stmt = this.handler.prepare("update users set state=$state where id=$userId;");
    //         const runResult = stmt.run({ state: 0, userId });
    //         if (runResult.changes <= 0) {
    //             success = false;
    //         }
    //     } catch (error) {
    //         success = false;
    //         console.log("[DbHelper.remove] ", error);
    //     }
    //     return success;
    // }
    add(newOrder) {
        let success = true;
        try {
            const stmt = this.handler.prepare(`INSERT INTO orders (order_id,client_oid, created_at, filled_notional, filled_size
                                    , funds, instrument_id, notional, order_type, price,price_avg
                                    , product_id, side, size, status, state
                                    , timestamp, type, acct_key)
                                VALUES ($order_id, $client_oid,$created_at, $filled_notional, $filled_size
                                    , $funds, $instrument_id, $notional, $order_type, $price,$price_avg
                                    , $product_id, $side, $size, $status, $state
                                    , $timestamp, $type,$acct_key);`);
            newOrder.acct_key = this.acct.httpkey;
            const runResult = stmt.run(newOrder);
            if (runResult.changes <= 0) {
                success = false;
            }
        }
        catch (error) {
            success = false;
            console.log("[addorders] ", error);
        }
        return success;
    }
    addInMonitor(newOrder) {
        let success = true;
        try {
            const stmt = this.handler.prepare(`INSERT INTO orders (order_id,client_oid,   filled_notional, filled_size
                                     , instrument_id, notional, order_type, price, side, size, status, state
                                    , timestamp, type, acct_key)
                                VALUES ($order_id, $client_oid,  $filled_notional, $filled_size
                                    , $instrument_id, $notional, $order_type, $price 
                                    ,  $side, $size, $status, $state
                                    , $timestamp, $type,$acct_key);`);
            newOrder.acct_key = this.acct.httpkey;
            const runResult = stmt.run(newOrder);
            if (runResult.changes <= 0) {
                success = false;
            }
        }
        catch (error) {
            success = false;
            console.log("[addorders] ", error);
        }
        return success;
    }
    addBatchOrder(newOrder) {
        let success = true;
        try {
            const stmt = this.handler.prepare(`INSERT INTO orders (order_id,client_oid, acct_key,instrument_id)
                                VALUES ($order_id, $client_oid,$acct_key,$instrument_id);`);
            newOrder.acct_key = this.acct.httpkey;
            const runResult = stmt.run(newOrder);
            if (runResult.changes <= 0) {
                success = false;
            }
        }
        catch (error) {
            success = false;
            console.log("[addorders] ", error);
        }
        return success;
    }
}
exports.DbOrders = DbOrders;
