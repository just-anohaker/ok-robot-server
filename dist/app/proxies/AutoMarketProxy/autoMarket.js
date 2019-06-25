"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = require('events').EventEmitter;
const { PublicClient } = require('@okfe/okex-node');
const { V3WebsocketClient } = require('@okfe/okex-node');
const { AuthenticatedClient } = require('@okfe/okex-node');
const config = require('../../config');
const publicInfo_1 = __importDefault(require("../../publicInfo"));
let authClient;
let toCancel = new Array();
let orderData = new Map();
let asks;
let bids;
let pci;
let acct;
let params;
let AT_startFlag = false;
var interval_rangeTaker;
var interval_canelOrder;
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
function initAutoMarket(_params, _acct) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("initAutoMarket! ");
        try {
            if (pci == undefined) {
                params = _params;
                acct = _acct;
                _acct.instrument_id = _params.instrument_id;
                pci = yield publicInfo_1.default.initPublicInfo({ instrument_id: _params.instrument_id });
                AT_startFlag = true;
                orderData = new Map();
                rangeTrading(_params, _acct);
            }
            else {
                return {
                    result: false,
                    error_message: 'AutoMarket is running!!'
                };
            }
        }
        catch (error) {
            console.log(error);
            return {
                result: false,
                error_message: error + ''
            };
        }
        return {
            result: true
        };
    });
}
/***
 * 接口:停止交易
 */
function stopAutoMarket() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("stopAutoMarket! ");
        if (interval_rangeTaker != undefined) {
            AT_startFlag = false;
            clearInterval(interval_rangeTaker);
            clearInterval(interval_canelOrder);
            interval_rangeTaker = undefined;
            interval_canelOrder = undefined;
            for (let j = 0; j < toCancel.length; j += 10) {
                let tmp = toCancel.slice(j, j + 10);
                // console.log("CancelBatchOrders interval_canelOrder:" + tmp)
                authClient.spot().postCancelBatchOrders([{ 'instrument_id': params.instrument_id, 'order_ids': tmp }]).then((batch_o) => __awaiter(this, void 0, void 0, function* () {
                    batch_o[params.instrument_id.toLowerCase()].forEach(function (ele) {
                        if (ele.result == true) {
                            // console.log("Cancel Order ok:" + ele.order_id)
                            toCancel = toCancel.filter(o => o != ele.order_id);
                        }
                    });
                }));
                yield sleep(100);
            }
            pci.stopWebsocket();
            pci = undefined;
            params = undefined;
            acct = undefined;
            return true;
        }
        else {
            return false;
        }
    });
}
/***
 * 接口:开始交易
 */
function startAutoMarket() {
    console.log("startAutoMarket! ");
    if (!AT_startFlag) {
        //rangeTrading()
        AT_startFlag = true;
        return true;
    }
    else {
        return false;
    }
}
/// !!!!!!需要对价格和数量做校验
/***
 * 接口:正在运行返回true 否则返回false
 */
function isRunning() {
    return interval_rangeTaker != undefined;
}
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    });
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
    };
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
* distance  //盘口距离
* startSize //开始数量
* topSize //最大数量
* countPerM //每分钟挂撤次数
* }
* acct:{}
* */
function rangeTrading(params, acct) {
    return __awaiter(this, void 0, void 0, function* () {
        AT_startFlag = true;
        let order_interval = 60 * 1000 / params.countPerM;
        authClient = new AuthenticatedClient(acct.httpkey, acct.httpsecret, acct.passphrase, config.urlHost);
        if (interval_rangeTaker != undefined)
            return;
        interval_rangeTaker = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            if (pci.asks && pci.bids) {
                let asks = pci.asks.slice(params.distance, params.distance + 1);
                let bids = pci.bids.slice(params.distance, params.distance + 1);
                let asks_orders = new Array();
                let bids_orders = new Array();
                // console.log("asks====", JSON.stringify(asks))
                // console.log(JSON.stringify(bids))
                for (let i = 1; i <= 10; i++) {
                    let perSize = getRandomArbitrary(parseFloat(params.startSize), parseFloat(params.topSize)).toFixed(4);
                    let sellprice;
                    let buyprice;
                    if (pci.instrumentInfo != undefined) {
                        sellprice = (parseFloat(asks[0]) + i * parseFloat(pci.instrumentInfo.size_increment)).toFixed(4);
                        buyprice = (parseFloat(bids[0]) - i * parseFloat(pci.instrumentInfo.size_increment)).toFixed(4);
                    }
                    else {
                        sellprice = (parseFloat(asks[0]) + i * 0.0001).toFixed(4);
                        buyprice = (parseFloat(bids[0]) - i * 0.0001).toFixed(4);
                    }
                    let sellOrder = {
                        'type': 'limit', 'side': 'sell',
                        'instrument_id': params.instrument_id, 'size': perSize, 'client_oid': config.orderType.onlyMaker + Date.now() + 'S' + i,
                        'price': sellprice, 'margin_trading': 1, 'order_type': '1' //postonly
                    };
                    let buyOrder = {
                        'type': 'limit', 'side': 'buy',
                        'instrument_id': params.instrument_id, 'size': perSize, 'client_oid': config.orderType.onlyMaker + Date.now() + 'B' + i,
                        'price': buyprice, 'margin_trading': 1, 'order_type': '1' //postonly
                    };
                    asks_orders.push(sellOrder);
                    bids_orders.push(buyOrder);
                }
                let asks_o = new Array();
                let bids_o = new Array();
                for (let j = 0; j < 10; j++) {
                    let randInt = getRandomIntInclusive(0, 19);
                    if (randInt < 10) {
                        bids_o = bids_o.concat(bids_orders.slice(randInt, randInt + 1));
                    }
                    else {
                        randInt = randInt % 10;
                        asks_o = asks_o.concat(asks_orders.slice(randInt, randInt + 1));
                    }
                }
                let orderss = asks_o.concat(bids_o);
                try {
                    authClient.spot().postBatchOrders(orderss).then((batch_o) => __awaiter(this, void 0, void 0, function* () {
                        let order_ids = [];
                        batch_o[params.instrument_id.toLowerCase()].forEach(function (ele) {
                            //  console.log("interval_autoMaker" + ele.result + "---" + ele.order_id)
                            if (ele.result) {
                                order_ids.push(ele.order_id);
                                toCancel.push(ele.order_id);
                            }
                        });
                        yield sleep(200);
                        // console.log("下单 orderss---", JSON.stringify(orderss))
                        try {
                            authClient.spot().postCancelBatchOrders([{ 'instrument_id': params.instrument_id, 'order_ids': order_ids }]).then((batch_o) => __awaiter(this, void 0, void 0, function* () {
                                batch_o[params.instrument_id.toLowerCase()].forEach(function (ele) {
                                    if (ele.result == true) { //没有成功撤单就交给垃圾回收
                                        // console.log("Cancel Order ok------:" + ele.order_id)
                                        toCancel = toCancel.filter(o => o != ele.order_id);
                                    }
                                });
                            }));
                        }
                        catch (error) {
                            console.log("CancelBatchOrders error " + error);
                        }
                    }));
                }
                catch (error) {
                    console.log("postBatchOrders error " + error);
                }
            }
        }), order_interval);
        interval_canelOrder = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            let res;
            let limit = 100;
            try {
                let order_ids = [];
                res = yield authClient.spot().getOrdersPending({ 'instrument_id': params.instrument_id, 'limit': limit });
                res.forEach((ele) => {
                    if (ele.client_oid.substring(0, 1) == config.orderType.onlyMaker) {
                        order_ids.push(ele.order_id);
                    }
                });
                // console.log("自动补单,取消未完成订单:", order_ids)
                if (order_ids.length <= 0)
                    return;
                try {
                    authClient.spot().postCancelBatchOrders([{ 'instrument_id': params.instrument_id, 'order_ids': order_ids }]).then((batch_o) => __awaiter(this, void 0, void 0, function* () {
                        batch_o[params.instrument_id.toLowerCase()].forEach(function (ele) {
                            if (ele.result == true) { //没有成功撤单就交给垃圾回收
                                // console.log("Cancel Order ok------:" + ele.order_id)
                                toCancel = toCancel.filter(o => o != ele.order_id);
                            }
                        });
                    }));
                }
                catch (error) {
                    console.log("CancelBatchOrders orderss interval_canelOrder " + error);
                }
            }
            catch (e) {
                console.log(e);
            }
        }), 10 * 1000);
    });
}
/**********  稳定市价  end  ***********************/
exports.default = {
    initAutoMarket,
    startAutoMarket,
    stopAutoMarket,
    isRunning,
    getParamsAndAcct
};
