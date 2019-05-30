/**
 * 接口:
 * params:
 * {type   //0同时买卖  1只买单 2只卖单
 * topPrice  //交易最高价
 * bottomPrice //交易最低价
 * intervalTime //间隔时间
 * volume //每次交易总量
 * }
 * acct:
 * {
 * name
 * httpkey
 * httpsecret
 * passphrase
 * }
 */
declare function setAutoTrade(params: any, acct: any): void;
/***
 * 接口:开始交易
 *
 */
declare function startAutoTrade(): boolean;
/***
 * 接口:停止交易
 */
declare function stopAutoTrade(): boolean;
declare const _default: {
    setAutoTrade: typeof setAutoTrade;
    startAutoTrade: typeof startAutoTrade;
    stopAutoTrade: typeof stopAutoTrade;
    innerEvent: any;
};
/**********  批量扫单   end  ***********************/
export = _default;
