/// <reference types="node" />
import { EventEmitter } from "events";
declare function initPageInfo(pamams: any): PageInfo;
/***
 * {
 * params:
 * instrument_id
 * channel
 * }
 */
declare function subscribeKline(params: any): {
    result: boolean;
    error_message: string;
} | {
    result: boolean;
    error_message?: undefined;
};
export declare class PageInfo {
    event: EventEmitter;
    private instrument_id;
    tickerData: any;
    private wss;
    private klineCannel;
    private isClosed;
    constructor(instrument_id: any);
    initData(): void;
    subscribeKline(params: any): void;
    unsubscribeKline(params: any): void;
    stopWebsocket(): void;
    startWebsocket(): void;
    sleep(ms: any): Promise<unknown>;
    isStoped(): any;
}
declare const _default: {
    initPageInfo: typeof initPageInfo;
    subscribeKline: typeof subscribeKline;
};
export default _default;
