/// <reference types="node" />
import { EventEmitter } from "events";
declare function initPublicInfo(pamams: any): Promise<PublicInfo>;
export declare class PublicInfo {
    event: EventEmitter;
    private instrument_id;
    tickerData: any;
    instrumentInfo: any;
    wss: any;
    bids: any;
    asks: any;
    private isClosed;
    private pClient;
    private interval_reconnet;
    constructor(instrument_id: any);
    initData(): Promise<void>;
    stopWebsocket(): void;
    startWebsocket(): void;
    sleep(ms: any): Promise<unknown>;
    isStoped(): any;
}
declare const _default: {
    initPublicInfo: typeof initPublicInfo;
};
export default _default;
