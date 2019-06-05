"use strict";
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
let orderData = new Map();
let asks;
let bids;
let pci;
let acct;
let params;
let AT_startFlag = false;
var interval_rangeTaker;
/**
 * 接口:
 * params:
 * {
 * topPrice  //交易最高价
 * bottomPrice //交易最低价
 * costLimit //成本上限
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
    console.log("initAutoMarket! ");
    params = _params;
    acct = _acct;
    pci = publicInfo_1.default();
    AT_startFlag = false;
    orderData = new Map();
    authClient = new AuthenticatedClient(acct.httpkey, acct.httpsecret, acct.passphrase, config.urlHost);
}
/***
 * 接口:停止交易
 */
function stopAutoMarket() {
    console.log("stopAutoMarket! ");
    if (AT_startFlag) {
        AT_startFlag = false;
        clearInterval(interval_rangeTaker);
        return true;
    }
    else {
        return false;
    }
}
/***
 * 接口:开始交易
 */
function startAutoMarket() {
    console.log("startAutoMarket! ");
    if (!AT_startFlag) {
        rangeTrading();
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
    return AT_startFlag;
}
/***
 * 接口:返回正在运行的参数
 * {Params:{}, //如第一个方法中的参数
 * Acct:{}
 * }
 */
function getParamsAndAcct() {
    return { params: params,
        acct: params };
}
function rangeTrading() {
    //定时获得深度,如果超出了就将目标价格的订单全部吃完
    interval_rangeTaker = setInterval(() => {
        if (pci.tickerData) {
            // var instrument_id = tickerData.instrument_id
            // var bid = tickerData.best_bid//买一 tickerData.best_ask//卖一
            pci.pClient.spot().getSpotBook(config.instrument_id, { size: 200 }).then(res => {
                if (res.asks && res.bids) {
                    if (params.bottomPrice > res.asks[0][0]) { //卖一的价格低于设置的底部价格,拉盘
                        let takeIndex = pci.asks.findIndex(function (ask) {
                            return params.bottomPrice < ask[0];
                        });
                        let toTake;
                        if (takeIndex < 0) {
                            toTake = res.asks;
                        }
                        else { //TODO 如果没有找到index 则全吃?
                            toTake = res.asks.slice(0, takeIndex);
                        }
                        let batchOrder = new Array();
                        let pre_price = 0;
                        toTake.forEach((ele) => {
                            batchOrder.push({
                                'type': 'limit', 'side': 'buy',
                                'instrument_id': config.instrument_id, 'size': ele[1],
                                'client_oid': 'spot123',
                                'price': ele[0], 'margin_trading': 1, 'order_type': '3'
                            }); //立即成交并取消剩余
                            pre_price += ele[0] * ele[1];
                        });
                        // console.log("触发托盘 需要下单:" + JSON.stringify(batchOrder));  //TODO 如果单子的数量大于10个就要拆分
                        console.log("预计成本: " + JSON.stringify(pre_price) + ' USDT');
                        // authClient.spot().postBatchOrders(JSON.stringify(toTake.slice(0,10)))
                    }
                    else if (params.topPrice < res.bids[0][0]) { //买一的价格高于设置的顶部价格,压盘
                        let takeIndex = pci.bids.findIndex(function (bid) {
                            return params.topPrice > bid[0];
                        });
                        let toTake;
                        if (takeIndex < 0) {
                            toTake = res.bids;
                        }
                        else { //TODO 如果没有找到index 则全吃?
                            toTake = res.bids.slice(0, takeIndex);
                        }
                        let batchOrder = new Array();
                        let pre_price = 0;
                        toTake.forEach((ele) => {
                            batchOrder.push({
                                'type': 'limit', 'side': 'sell',
                                'instrument_id': config.instrument_id, 'size': ele[1],
                                'client_oid': 'spot123',
                                'price': ele[0], 'margin_trading': 1, 'order_type': '3'
                            }); //立即成交并取消剩余
                            pre_price += ele[0] * ele[1];
                        });
                        /// console.log("触发压盘 需要下单:" + JSON.stringify(batchOrder));  //TODO 如果单子的数量大于10个就要拆分
                        console.log("预计成本: " + JSON.stringify(pre_price) + ' USDT');
                    }
                }
            });
        }
    }, 5 * 1000);
}
/**********  稳定市价  end  ***********************/
exports.default = {
    initAutoMarket,
    startAutoMarket,
    stopAutoMarket,
    isRunning,
    getParamsAndAcct
};
