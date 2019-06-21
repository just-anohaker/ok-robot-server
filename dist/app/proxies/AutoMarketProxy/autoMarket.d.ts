/**
 * 接口:
 * params:
 * {
 * distance  //离盘口的距离
 * startSize //开始数量
 * topSize //
 * countPerM
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
 * 接口:  成功返回true 失败返回false
 */
declare function initAutoMarket(_params: any, _acct: any): Promise<{
    result: boolean;
    error_message: string;
} | {
    result: boolean;
    error_message?: undefined;
}>;
/***
 * 接口:停止交易
 */
declare function stopAutoMarket(): Promise<boolean>;
/***
 * 接口:开始交易
 */
declare function startAutoMarket(): boolean;
/***
 * 接口:正在运行返回true 否则返回false
 */
declare function isRunning(): boolean;
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
    initAutoMarket: typeof initAutoMarket;
    startAutoMarket: typeof startAutoMarket;
    stopAutoMarket: typeof stopAutoMarket;
    isRunning: typeof isRunning;
    getParamsAndAcct: typeof getParamsAndAcct;
};
/**********  稳定市价  end  ***********************/
export default _default;
