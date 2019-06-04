export interface Account {
    id?: string;
    groupName?: string;
    name: string;
    httpKey: string;
    httpSecret: string;
    passphrase: string;
}
export interface UpdateAccount {
    readonly groupName?: string;
    readonly name?: string;
    readonly httpKey?: string;
    readonly httpSecret?: string;
    readonly passphrase?: string;
}
export interface OKexAccount {
    name: string;
    httpKey: string;
    httpSecret: string;
    passphrase: string;
}
export declare enum TradeType {
    Both = 0,
    OnlyBuy = 1,
    OnlySell = 2
}
export declare enum TradeActionType {
    Withdrawal = 0,
    Orders = 1
}
export interface AutoMakerOptions {
    type: TradeType;
    topPrice: number;
    bottomPrice: number;
    intervalTime: number;
    startVolume: number;
    endVolume: number;
    tradeType: TradeActionType;
    tradeLimit: number;
}
export interface AutoMarketOptions {
    topPrice: number;
    bottomPrice: number;
    costLimit: number;
}
export interface BatchOrderOptions {
    type: TradeType;
    topPrice: number;
    startPrice: number;
    incr: number;
    topSize: number;
    count: number;
}
export interface TakeOrderOptions {
    type: TradeType;
    toPrice: number;
}
export declare const NotificationDeep = "spot/depth";
export declare const NotificationTicker = "spot/ticker";
export declare const NotificationOrder = "spot/order";
