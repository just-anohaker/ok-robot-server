var EventEmitter = require('events').EventEmitter;
const { PublicClient } = require('@okfe/okex-node');
const { V3WebsocketClient } = require('@okfe/okex-node');
const { AuthenticatedClient } = require('@okfe/okex-node');
import acctInfo, { AccountInfo } from "../../acctInfo2";
var config = require('../../config');
// var publicInfo = require('../../publicInfo');
import publicInfo from "../../publicInfo";
let authClient;

let orderData = new Map();
let pci;
let acct;
let params;
let AT_startFlag = false;
let interval_autoTaker
let interval_autoMaker
let ai
/// !!!!!!需要对价格和数量做校验
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
* perSize //每次挂单数量
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
function initAutoMaker(_params, _acct) {
    console.log("startAutoTrade! ");

    params = _params;
    acct = _acct;
    // pci = publicInfo();
    // AT_startFlag = false;
    // orderData = new Map();
    // authClient = new AuthenticatedClient(acct.httpkey,
    //     acct.httpsecret, acct.passphrase, config.urlHost);
    // initOrder();
    //TODO ?循环检查 如果有没关闭的就关闭

    _acct.instrument_id = _params.instrument_id
    ai = acctInfo.acctInfo(_acct);
    ai.startAutoMaker(_params);
}
// stopAutoMaker() {
//     clearInterval(this.interval_autoMaker)
//     this.interval_autoMaker = undefined
// }
// isAutoMaker() {
//     return this.interval_autoMaker != undefined
// }
/***
 * 接口:停止交易
 */
function stopAutoTrade() {
    console.log("stopAutoTrade! ");
    //_acct.instrument_id = _params.instrument_id
    // let ai = acctInfo.acctInfo(_acct);
    if (ai != undefined) {
        ai.stopAutoMaker();
        return true
    } {
        return false
    }

}

/***
 * 接口:开始交易
 */
function startAutoTrade() {
    console.log("stopAutoTrade! ");
    // ai.startAutoMaker();
    if (!AT_startFlag) {
        //startMakeOrder();
        //  startTakeOrder();
        AT_startFlag = true;
        return true
    }
    else {
        return false
    }
}
/***
 * 接口:正在运行返回true 否则返回false
 */
function isRunning() {
    if (ai == undefined) {
        return false
    } else {
        return ai.isAutoMaker()
    }
}

/***
 * 接口:返回正在运行的参数
 * {Params:{}, //如第一个方法中的参数
 * Acct:{}
 * }
 */
function getParamsAndAcct() {
    return {
        params: params,
        acct: acct
    }
}

function initOrder() {
    authClient.spot().getOrdersPending({ 'instrument_id': config.instrument_id })//from to order_id ledger_id trade_id
        .then(res => {
            res.forEach((ele) => {
                console.log("init add Pending order to map " + JSON.stringify(ele))
                orderData.set(ele.order_id, ele)
            })
        })
}


function startMakeOrder() {
    //TODO 获取订单列表 初始化到orderData
    interval_autoMaker = setInterval(() => {
        if (pci.tickerData) {
            // var instrument_id = tickerData.instrument_id
            // var bid = tickerData.best_bid//买一 tickerData.best_ask//卖一
            console.log("interval ---" + pci.tickerData.instrument_id + `买一 ` + pci.tickerData.best_bid + ' 卖一 ' + pci.tickerData.best_ask + ' 最新成交价:' + pci.tickerData.last);
            authClient.spot().postOrder({
                'type': 'limit', 'side': 'buy',
                'instrument_id': config.instrument_id, 'size': 1, 'client_oid': 'spot123',
                'price': 0.01, 'margin_trading': 1, 'order_type': '1'
            }).then(res => {
                if (res.result && res.order_id) {
                    authClient.spot().getOrder(res.order_id, { 'instrument_id': config.instrument_id })
                        .then(res => {
                            // console.log(JSON.stringify(res));
                            console.log("下单成功---" + JSON.stringify(res))
                            orderData.set(res.order_id, res);
                        });
                    // console.log("下单成功---"+JSON.stringify(res))
                }
            })
        } else {
            console.log("无法获取当前盘口价格!")
        }
    }, params.intervalTime)
}
function startTakeOrder() {
    interval_autoTaker = setInterval(() => {
        orderData.forEach((value, key, map) => {
            // console.log("服务器当前时间:"+Date.parse(tickerData.timestamp));
            // console.log("系统当前时间:"+Date.now());
            var t = pci.tickerData.timestamp ? Date.parse(pci.tickerData.timestamp) : Date.now();//系统当前时间或者服务器当前时间
            if (value.state != 2 && t - Date.parse(value.timestamp) > params.intervalTime) {
                //吃自己的单?  //先看当前价格 如果当前价格不是自己的单就吃最新价单.?然后撤消自己的单
                authClient.spot().postCancelOrder(key, { 'instrument_id': value.instrument_id }).then(res => {
                    if (res.result && value.order_id) {
                        //    authClient.spot().getOrder(value.order_id,{'instrument_id':instrument_id})
                        //    .then(res =>{

                        // //     orderData.put(res.order_id,res);
                        //  });
                        console.log("撤消订单成功---" + value.order_id);
                        orderData.delete(value.order_id)
                    } else {
                        console.log("撤消订单失败---" + JSON.stringify(res))
                    }
                })
            }
        })

    }, params.intervalTime)
}



// initAutoMaker({intervalTime:5*1000},{httpkey:config.httpkey,
//     httpsecret:config.httpsecret, passphrase:config.passphrase});
// startAutoTrade()
export default {
    initAutoMaker,
    startAutoTrade,
    stopAutoTrade,
    isRunning,
    getParamsAndAcct
}