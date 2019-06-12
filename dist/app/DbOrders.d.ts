import Sqlite3 = require("better-sqlite3");
import { Order } from "./Types";
export declare class DbOrders {
    private handler;
    private acct;
    constructor(handler: Sqlite3.Database, acct: any);
    getOrders(sql: any, params: any): any;
    getOrderByOrderId(id: any): any;
    update(sql: any, params: any): boolean;
    updateAllInfo(params: any): boolean;
    add(newOrder: Order): boolean;
    addBatchOrder(newOrder: Order): boolean;
}
