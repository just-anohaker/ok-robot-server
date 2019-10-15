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
    name?: string;
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
export interface Order {
    "acct_key": string,
    "order_id": string,
    "client_oid": string,
    "created_at": string,
    "filled_notional": string,
    "filled_size": string,
    "funds": string,
    "instrument_id": string,
    "notional": string,
    "order_type": string,
    "price": string,
    "price_avg": string,
    "product_id": string,
    "side": string,
    "size": string,
    "status": string,
    "state": string,
    "timestamp": string,
    "type": string
}

export interface Warning {
    'wid': String,
    'acct_key': String,
    'instrument_id':String,
    'filepath': String,
    'minprice': String,
    'maxprice': String,
    'utime': String,
    'pecent': String,
    'status': String,
    'timestamp': String,
    'type': String
}
export const NotificationDeep = "spot/depth";
export const NotificationTicker = "spot/ticker";
export const NotificationOrder = "spot/order";


export interface OkexTickerParameters {
    instrument_id?: string;
}

export interface OkexTradeParameters {
    instrument_id: string;
    params: { [key: string]: any } | string;
}

export interface OkexCandlesParameters {
    instrument_id: string;
    params: { [key: string]: any } | string;
}

export interface OkexWalletInfo {
    id: string;
    currency: string;
    hold: string;
    available: string;
    balance: string;
}

export interface OkexCurrencyInfo {
    name?: string;
    currency: string;
}