export interface Account {
    id?: string;
    groupName?: string;
    name: string;
    httpkey: string;
    httpsecret: string;
    passphrase: string;
}

export interface UpdateAccount {
    readonly groupName?: string;
    readonly name?: string;
    readonly httpkey?: string;
    readonly httpsecret?: string;
    readonly passphrase?: string;
}


export interface OKexAccount {
    name: string;
    httpkey: string;
    httpsecret: string;
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
    type: TradeType;
    startSize: number;
    isCancel: boolean;
}

export interface BatchOrderOptions {
    type: TradeType;
    topPrice: number;
    startPrice: number;
    incr: number;
    size: number;
    sizeIncr: number;
}

export interface BatchOrderCancelOptions {
    type: TradeType;
    topPrice: number;
    startPrice: number;
}

export interface TakeOrderOptions {
    type: TradeType;
    toPrice: number;
}

export const NotificationDeep = "spot/depth";
export const NotificationTicker = "spot/ticker";
export const NotificationOrder = "spot/order";