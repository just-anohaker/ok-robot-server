export interface IAccount {
    id?: string;
    groupName?: string;
    name: string;
    apiKey: string;
    apiSecret: string;
}
export interface IUpdateAccount {
    readonly groupName?: string;
    readonly name?: string;
    readonly apiKey?: string;
    readonly apiSecret?: string;
}
export interface IOKexAccount {
    name: string;
    httpKey: string;
    httpSecret: string;
    passphrase: string;
}
export declare enum OKExAutoTradeType {
    Both = 0,
    OnlyBuy = 1,
    OnlySell = 2
}
export interface OKExAutoTradeOptions {
    type: OKExAutoTradeType;
    topPrice: number;
    bottomPrice: number;
    intervalTime: number;
    volumn: number;
}
export declare const NotificationDeep = "spot/depth";
export declare const NotificationTicker = "spot/ticker";
export declare const NotificationOrder = "spot/order";
