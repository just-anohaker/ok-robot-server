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

    params = _params;
    acct = _acct;
    // if (pci != undefined) {
    //     pci = publicInfo.initPublicInfo({ intrument_id: _params.intrument_id });
    //     AT_startFlag = false;
    //     orderData = new Map();
    //     authClient = new AuthenticatedClient(acct.httpkey,
    //         acct.httpsecret, acct.passphrase, config.urlHost);
    // }
    try {
        if (pci == undefined) {
            _acct.instrument_id = _params.instrument_id
            pci = await publicInfo.initPublicInfo({ instrument_id: _params.instrument_id });
            AT_startFlag = true;
            orderData = new Map();
            rangeTrading(_params, _acct)
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
        pci.stopWebsocket();
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
        pci = undefined
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
    return AT_startFlag
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
* distance  //离盘口的距离
* startSize //开始数量
* topSize //
* countPerM
* }
* */
async function rangeTrading(params, acct) {
    AT_startFlag = true;
    let order_interval = 60 * 1000 / params.countPerM
    authClient = new AuthenticatedClient(acct.httpkey,
        acct.httpsecret, acct.passphrase, config.urlHost);

    if (interval_rangeTaker != undefined) return
    interval_rangeTaker = setInterval(async () => {
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
            for (let j = 0; j < 10; j++) {
                let randInt = getRandomIntInclusive(0, 19);
                if (randInt < 10) {
                    bids_o = bids_o.concat(bids_orders.slice(randInt, randInt + 1))
                } else {
                    randInt = randInt % 10
                    asks_o = asks_o.concat(asks_orders.slice(randInt, randInt + 1))
                }
            }
            let orderss = asks_o.concat(bids_o)

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
                    await sleep(200)
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
                        console.log("CancelBatchOrders orderss " + error)
                        // batch_o[params.instrument_id.toLowerCase()].forEach(function (ele) {
                        //     if (ele.result) {
                        //         toCancel.push(ele.order_id)
                        //     }
                        // })
                    }

                });
            } catch (error) {
                console.log("CancelBatchOrders orderss " + error)

            }

        }
    }, order_interval);
    interval_canelOrder = setInterval(async () => {//垃圾回收  检查所有订单的oclientid 然后循环撤单 TODO
        for (let j = 0; j < toCancel.length; j += 10) {
            let tmp = toCancel.slice(j, j + 10)
            // console.log("CancelBatchOrders interval_canelOrder:" + tmp)
            authClient.spot().postCancelBatchOrders([{ 'instrument_id': params.instrument_id, 'order_ids': tmp }]).then(async batch_o => {
                batch_o[params.instrument_id.toLowerCase()].forEach(function (ele) {
                    if (ele.result == true) {
                        // console.log("Cancel Order ok:" + ele.order_id)
                        toCancel = toCancel.filter(o => o != ele.order_id)
                    } else {
                        if (ele.code == "33014") {
                            toCancel = toCancel.filter(o => o != ele.order_id)
                            console.log("error order_id", ele.order_id)
                        }
                    }
                })
            });
            await sleep(100)
        }
    }, 10 * 1000);

}
/**********  稳定市价  end  ***********************/
export default {
    initAutoMarket,
    startAutoMarket,
    stopAutoMarket,
    isRunning,
    getParamsAndAcct
}