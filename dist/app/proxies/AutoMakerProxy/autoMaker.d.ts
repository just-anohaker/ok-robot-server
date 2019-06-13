/**
 * 接口:
 * params:
 * {type   //0同时买卖  1只买单 2只卖单
 * topPrice  //交易最高价
 * bottomPrice //交易最低价
 * intervalTime //间隔时间  1
 * volume //每次交易总量 100
 * }
 * acct:
 * {
 * name
 * httpkey
 * httpsecret
 * passphrase
 * }
 */
/***
* params:
* {
* perStartSize //每次挂单数量
* perTopSize
* countPerM  //每分钟成交多少笔
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
declare function initAutoMaker(_params: any, _acct: any): {
    result: boolean;
    error_message: string;
} | {
    result: boolean;
    error_message?: undefined;
};
/***
 * 接口:停止交易
 */
declare function stopAutoTrade(): boolean;
/***
 * 接口:开始交易
 */
declare function startAutoTrade(): boolean;
/***
 * 接口:正在运行返回true 否则返回false
 */
declare function isRunning(): any;
/***
 * 接口:返回正在运行的参数
 * {Params:{}, //如第一个方法中的参数
 * Acct:{}
 * }
 */
declare function getParamsAndAcct(): {
    params: any;
    acct: any;
};
declare const _default: {
    initAutoMaker: typeof initAutoMaker;
    startAutoTrade: typeof startAutoTrade;
    stopAutoTrade: typeof stopAutoTrade;
    isRunning: typeof isRunning;
    getParamsAndAcct: typeof getParamsAndAcct;
};
export default _default;
