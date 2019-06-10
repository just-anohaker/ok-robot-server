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
    private tickerData;
    private asks;
    private bids;
    private isClosed;
    private pendingOrders;
    private orderPrice;
    private wss;
    private pClient;
    private authClient;
    constructor(instrument_id: any, httpkey: any, httpsecret: any, passphrase: any);
    initOrderData(): Promise<{
        result: boolean;
        error_message: string;
    }>;
    stopWebsocket(): void;
    startWebsocket(): void;
    sleep(ms: any): Promise<unknown>;
    orderMonitor(): void;
}
declare const _default: {
    acctInfo: typeof acctInfo;
    stopWebsocket: typeof stopWebsocket;
};
export default _default;
