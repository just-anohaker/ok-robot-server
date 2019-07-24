var EventEmitter = require('events').EventEmitter;
const { PublicClient } = require('@okfe/okex-node');
const { V3WebsocketClient } = require('@okfe/okex-node');
const { AuthenticatedClient } = require('@okfe/okex-node');
const config = require('../../config');
import publicInfo, { PublicInfo } from "../../publicInfo";
import { arrayExpression } from "@babel/types";
let authClient;
let toCancel = new Array();
let orderData = new Map();
let asks;
let bids;
let pci: any;

let acct;
let params;
let AT_startFlag = false;

var interval_rangeTaker
var interval_canelOrder
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
async function initAutoMarket(_params, _acct) {
    console.log("initAutoMarket! ");
    try {
        if (pci == undefined) {
            params = _params;
            acct = _acct;
            _acct.instrument_id = _params.instrument_id
            pci = await publicInfo.initPublicInfo({ instrument_id: _params.instrument_id });
            AT_startFlag = true;
            orderData = new Map();
            rangeTrading(_params, _acct)
        } else {
            return {
                result: false,
                error_message: 'AutoMarket is running!!'
            };

        }

    } catch (error) {
        console.log(error)
        return {
            result: false,
            error_message: error + ''
        };
    }
    return {
        result: true
    }

}

/***
 * 接口:停止交易
 */
async function stopAutoMarket() {
    console.log("stopAutoMarket! ");
    if (interval_rangeTaker != undefined) {
        AT_startFlag = false;
        clearInterval(interval_rangeTaker);
        clearInterval(interval_canelOrder);
        interval_rangeTaker = undefined
        interval_canelOrder = undefined
        for (let j = 0; j < toCancel.length; j += 10) {
            let tmp = toCancel.slice(j, j + 10)
            // console.log("CancelBatchOrders interval_canelOrder:" + tmp)
            authClient.spot().postCancelBatchOrders([{ 'instrument_id': params.instrument_id, 'order_ids': tmp }]).then(async batch_o => {
                batch_o[params.instrument_id.toLowerCase()].forEach(function (ele) {
                    if (ele.result == true) {
                        // console.log("Cancel Order ok:" + ele.order_id)
                        toCancel = toCancel.filter(o => o != ele.order_id)
                    }
                })
            });
            await sleep(100)
        }
        pci.stopWebsocket();
        pci = undefined
        params = undefined;
        acct = undefined;
        return true
    } else {
        return false
    }
}

/***
 * 接口:开始交易
 */
function startAutoMarket() {
    console.log("startAutoMarket! ");
    if (!AT_startFlag) {
        //rangeTrading()
        AT_startFlag = true;
        return true
    }
    else {
        return false
    }
}
/// !!!!!!需要对价格和数量做校验
/***
 * 接口:正在运行返回true 否则返回false
 */
function isRunning() {
    return interval_rangeTaker != undefined
}
async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
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
        acct: params
    }
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值 
}

/* params:
* {
* type // 1 双边，2 买方 ，3 卖方
* distance  //盘口距离
* startSize //开始数量
* topSize //最大数量
* countPerM //每分钟挂撤次数
* count //随机个数
* }
* acct:{}
* */
async function rangeTrading(params, acct) {
    AT_startFlag = true;
    let order_interval = 60 * 1000 / params.countPerM
    authClient = new AuthenticatedClient(acct.httpkey,
        acct.httpsecret, acct.passphrase, config.urlHost);

    if (interval_rangeTaker != undefined) return
    interval_rangeTaker = setInterval(async () => {
        let t=new Date(pci.tickerData.timestamp).getTime();
         // console.log( Math.abs(Date.now() - t) )
         if(pci.tickerData &&  Math.abs(Date.now() - t) > 60*1000){
             console.log("无法自动补单! ticker data time exceed ",Math.abs(Date.now() - t)/1000, "s")
             return 
         }
        if (pci.asks && pci.bids) {
            let asks = pci.asks.slice(params.distance, params.distance + 1);
            let bids = pci.bids.slice(params.distance, params.distance + 1);
            let asks_orders = new Array();
            let bids_orders = new Array();
            // console.log("asks====", JSON.stringify(asks))
            // console.log(JSON.stringify(bids))

            for (let i = 1; i <= 10; i++) {
                let perSize = getRandomArbitrary(parseFloat(params.startSize), parseFloat(params.topSize)).toFixed(4)
                let sellprice
                let buyprice
                if (pci.instrumentInfo != undefined) {
                    sellprice = (parseFloat(asks[0]) + i * parseFloat(pci.instrumentInfo.size_increment)).toFixed(4)
                    buyprice = (parseFloat(bids[0]) - i * parseFloat(pci.instrumentInfo.size_increment)).toFixed(4)
                } else {
                    sellprice = (parseFloat(asks[0]) + i * 0.0001).toFixed(4)
                    buyprice = (parseFloat(bids[0]) - i * 0.0001).toFixed(4)
                }
                let sellOrder = {
                    'type': 'limit', 'side': 'sell',
                    'instrument_id': params.instrument_id, 'size': perSize, 'client_oid': config.orderType.onlyMaker + Date.now() + 'S' + i,
                    'price': sellprice, 'margin_trading': 1, 'order_type': '1'//postonly
                };
                let buyOrder = {
                    'type': 'limit', 'side': 'buy',
                    'instrument_id': params.instrument_id, 'size': perSize, 'client_oid': config.orderType.onlyMaker + Date.now() + 'B' + i,
                    'price': buyprice, 'margin_trading': 1, 'order_type': '1'//postonly
                };
                asks_orders.push(sellOrder)
                bids_orders.push(buyOrder)
            }
            let asks_o = new Array();
            let bids_o = new Array();
            params.count = params.count<10?params.count:10
            for (let j = 0; j < params.count; j++) {
                let randInt  = 1;
                if(params.type == 1){
                    randInt = getRandomIntInclusive(0, 19)
                }else if(params.type == 2){
                    randInt = getRandomIntInclusive(0, 9)
                }else if(params.type == 3){
                    randInt = getRandomIntInclusive(10, 19)
                }
                if (randInt < 10) {
                    bids_o = bids_o.concat(bids_orders.slice(randInt, randInt + 1))
                } else {
                    randInt = randInt % 10
                    asks_o = asks_o.concat(asks_orders.slice(randInt, randInt + 1))
                }
            }
            let orderss = asks_o.concat(bids_o)
            console.log("market orders price:",JSON.stringify(orderss.map(x=>x.price)));
            try {
                authClient.spot().postBatchOrders(orderss).then(async batch_o => {
                    let order_ids = []
                    batch_o[params.instrument_id.toLowerCase()].forEach(function (ele) {
                        //  console.log("interval_autoMaker" + ele.result + "---" + ele.order_id)
                        if (ele.result) {
                            order_ids.push(ele.order_id);
                            toCancel.push(ele.order_id);
                        }
                    })
                    let randSleepT = getRandomIntInclusive(0, 400);
                    await sleep(randSleepT)
                   // console.log("下单 orderss---", JSON.stringify(orderss))
                    try {
                        authClient.spot().postCancelBatchOrders([{ 'instrument_id': params.instrument_id, 'order_ids': order_ids }]).then(async batch_o => {
                            batch_o[params.instrument_id.toLowerCase()].forEach(function (ele) {
                                if (ele.result == true) {//没有成功撤单就交给垃圾回收
                                    // console.log("Cancel Order ok------:" + ele.order_id)
                                    toCancel = toCancel.filter(o => o != ele.order_id)
                                }
                            })
                        });
                    } catch (error) {
                        console.log("CancelBatchOrders error " + error)

                    }

                });
            } catch (error) {
                console.log("postBatchOrders error " + error)

            }

        }
    }, order_interval);
    interval_canelOrder = setInterval(async () => {//垃圾回收  检查所有订单 然后循环撤单 
        let res
        let limit = 100
        try {
            let order_ids = []
            res = await authClient.spot().getOrdersPending({ 'instrument_id': params.instrument_id, 'limit': limit });
            res.forEach((ele) => {
                if (ele.client_oid.substring(0, 1) == config.orderType.onlyMaker) {
                    order_ids.push(ele.order_id);
                }
            })
            // console.log("自动补单,取消未完成订单:", order_ids)
            if (order_ids.length <= 0) return;
            for (let j = 0; j < order_ids.length; j += 10) {
                let tmp = order_ids.slice(j, j + 10)
                let batch_o = await authClient.spot().postCancelBatchOrders([{ 'instrument_id': params.instrument_id, 'order_ids': tmp }]);
                batch_o[params.instrument_id.toLowerCase()].forEach(function (ele) {
                    if (ele.result == true) {//没有成功撤单就交给垃圾回收
                        // console.log("Cancel Order ok------:" + ele.order_id)
                        toCancel = toCancel.filter(o => o != ele.order_id)
                    }
                })
                await sleep(50);//每秒20次 限制是每2秒50次
               // console.log("撤消订单 only maker---" + JSON.stringify(batch_o))//
            }
     
        } catch (e) {
            console.log(e+ '')
        }
    }, 3 * 1000);
}
/**********  稳定市价  end  ***********************/
export default {
    initAutoMarket,
    startAutoMarket,
    stopAutoMarket,
    isRunning,
    getParamsAndAcct
}