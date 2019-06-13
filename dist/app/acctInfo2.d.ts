/// <reference types="node" />
import { EventEmitter } from "events";
declare function acctInfo(pamams: any): AccountInfo;
declare function stopWebsocket(pamams: any): void;
export declare class AccountInfo {
    event: EventEmitter;
    private httpkey;
    private httpsecret;
    private passphrase;
    private instrument_id;
    tickerData: any;
    asks: any;
    bids: any;
    isClosed: any;
    pendingOrders: any;
    orderPrice: any;
    private wss;
    private pClient;
    private authClient;
    private interval_autoMaker;
    private order_db;
    private autoMakerOrder;
    constructor(instrument_id: any, httpkey: any, httpsecret: any, passphrase: any);
    initOrderData(): Promise<{
        result: boolean;
        error_message: string;
    }>;
    stopWebsocket(): void;
    startWebsocket(): void;
    sleep(ms: any): Promise<unknown>;
    getRandomIntInclusive(min: any, max: any): any;
    getRandomArbitrary(min: any, max: any): any;
    orderMonitor(): void;
    /**
     *   //每次挂单数量
     * perStartSize
     * perTopSize
        params.countPerM  //每分钟成交多少笔
        params.instrument_id
     */
    startAutoMaker(params: any): {
        result: boolean;
        error_message: string;
    };
    stopAutoMaker(): void;
    isAutoMaker(): boolean;
}
declare const _default: {
    acctInfo: typeof acctInfo;
    stopWebsocket: typeof stopWebsocket;
};
export default _default;
