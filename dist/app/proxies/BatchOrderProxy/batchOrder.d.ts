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
declare function startDepInfo(acct: any): Promise<any>;
declare const _default: {
    genBatchOrder: typeof genBatchOrder;
    cancelBatchOrder: typeof cancelBatchOrder;
    limitOrder: typeof limitOrder;
    marketOrder: typeof marketOrder;
    startDepInfo: typeof startDepInfo;
};
export default _default;
