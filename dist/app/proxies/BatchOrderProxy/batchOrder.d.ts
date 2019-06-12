import { AccountInfo } from "../../acctInfo2";
/**
 * 接口:
 * params:
 * {
 * type   //1 买入  2 卖出
 * topPrice  //交易最高价
 * startPrice //交易最低价
 * incr //价格增量百分比
 * size  //挂单数量
 * sizeIncr //数量递增百分比
 * instrument_id
 * }
  return 一个对象
 * }
 */
declare function genBatchOrder(params: any, acct: any): Promise<{
    result: boolean;
    error_message: string;
    orders?: undefined;
    cost?: undefined;
} | {
    result: boolean;
    orders: any[];
    cost: number;
    error_message?: undefined;
}>;
/****
  * params:
 * {
 * type   //1 买入  2 卖出
 * topPrice  //交易最高价
 * startPrice //交易最低价
 * instrument_id
 * }
 * acct:
 * {
 * name
 * httpkey
 * httpsecret
 * passphrase
 * }
 * return {}
 */
declare function cancelBatchOrder(params: any, acct: any): Promise<{
    result: boolean;
    error_message: string;
} | {
    result: boolean;
    error_message?: undefined;
}>;
/****
  * params:
 * {
 * type   //1 买入  2 卖出
 * depth  //深度
 * size //数量
 * perSize //单笔数量
 * priceLimit //价格限制
 * instrument_id
 * }
 * acct:
 * {
 * name
 * httpkey
 * httpsecret
 * passphrase
 * }
 * return string
 */
/***
 * params:
 * {
 * type   //1 买入  2 卖出
 * price  //价格
 * size //数量
 * }
 * acct:
 * {
 * name
 * httpkey
 * httpsecret
 * passphrase
 * }
 */
declare function limitOrder(params: any, acct: any): Promise<any>;
/***
 * params:
 * {
 * type   //1 买入  2 卖出
 * notional  //买入时的金额
 * size //数量  卖出时的数量
 * instrument_id
 * }
 * acct:
 * {
 * name
 * httpkey
 * httpsecret
 * passphrase
 * }
 */
declare function marketOrder(params: any, acct: any): Promise<any>;
/***
 * params:
 * {
 * instrument_id
 * httpkey
 * httpsecret
 * passphrase
 * }
 */
declare function startDepInfo(params: any): Promise<AccountInfo>;
/***
 * params:
 * {
 * instrument_id
 * httpkey
 * httpsecret
 * passphrase
 * }
 */
declare function stopDepInfo(params: any): Promise<{
    result: boolean;
    error_message: any;
} | {
    result: boolean;
    error_message?: undefined;
}>;
/***
 * params:
 * {
 * instrument_id
 * from
 * to
 * limit 订单状态("-2":失败,"-1":撤单成功,"0":等待成交 ,"1":部分成交, "2":完全成交,"3":下单中,"4":撤单中,"6": 未完成（等待成交+部分成交），"7":已完成（撤单成功+完全成交））
 * state
 * }
 * acct:
 * {
 * name
 * httpkey
 * httpsecret
 * passphrase
 * }
 */
declare function getOrderData(params: any, acct: any): Promise<{
    result: boolean;
    error_message: string;
    list?: undefined;
    length?: undefined;
} | {
    list: any;
    length: any;
    result?: undefined;
    error_message?: undefined;
}>;
declare const _default: {
    genBatchOrder: typeof genBatchOrder;
    cancelBatchOrder: typeof cancelBatchOrder;
    limitOrder: typeof limitOrder;
    marketOrder: typeof marketOrder;
    startDepInfo: typeof startDepInfo;
    stopDepInfo: typeof stopDepInfo;
    getOrderData: typeof getOrderData;
};
export default _default;
