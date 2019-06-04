export interface Account {
    id?: string;
    groupName?: string;
    name: string;
    apiKey: string;
    apiSecret: string;
}

export interface UpdateAccount {
    readonly groupName?: string;
    readonly name?: string;
    readonly apiKey?: string;
    readonly apiSecret?: string;
}


export interface OKexAccount {
    name: string;
    httpKey: string;
    httpSecret: string;
    passphrase: string;
}

export enum TradeType {
    Both = 0,
    OnlyBuy,
    OnlySell
}

export enum TradeActionType {
    Withdrawal = 0,
    Orders
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
    costLimit: number
}

export interface BatchOrderOptions {
    type: TradeType;
    topPrice: number;
    startPrice: number;
    incr: number;
    topSize: number;
    count: number
}

export interface TakeOrderOptions {
    type: TradeType;
    toPrice: number;
}

export const NotificationDeep = "spot/depth";
export const NotificationTicker = "spot/ticker";
export const NotificationOrder = "spot/order";