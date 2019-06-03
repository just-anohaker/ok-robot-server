var EventEmitter = require('events').EventEmitter;
const { PublicClient } = require('@okfe/okex-node');
const { V3WebsocketClient } = require('@okfe/okex-node');
const { AuthenticatedClient } = require('@okfe/okex-node');
var config = require('./config');

const pClient = PublicClient(config.urlHost);

const authClient = AuthenticatedClient(config.httpkey,
    config.httpsecret, config.passphrase, config.urlHost);

const wss = new V3WebsocketClient(config.websocekHost);


const channel_depth = 'spot/depth';
const channel_ticker = 'spot/ticker';
const channel_order = "spot/order"

const instrument_id = "ZIL-USDT";
const currency = 'ZIL';


let interval_volume = 20 * 1000;
let tickerData;
let orderData = new Map();
let asks;
let bids;

let AutoTradeAcct;
let AutoTradeParams;
let AT_startFlag = false;
var interval_auto
var interval_autoTaker
var interval_autoMaker

/**
 * 接口:事件监听
 * */
const innerEvent = new EventEmitter();

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
function setAutoTrade(params, acct) {
    console.log("setAutoTrade params: " + JSON.stringify(params) + " acct :" + JSON.stringify(acct));
    AutoTradeParams = params;
    AutoTradeAcct = acct;
}
/***
 * 接口:开始交易
 * 
 */
function startAutoTrade() {
    console.log("startAutoTrade! ");
    if (!AT_startFlag) {
        AT_startFlag = true;
    }
    init();
    startWebsocket();
    startMakeOrder()
    startTakeOrder()
    //TODO ?循环检查 如果有没关闭的就关闭
    return true
}
/***
 * 接口:停止交易
 */
function stopAutoTrade() {
    console.log("stopAutoTrade! ");
    if (AT_startFlag) {
        AT_startFlag = false;
    }
    clearInterval(interval_autoMaker)
    clearInterval(interval_autoTaker)
    return true
}


function init() {
    authClient.spot().getOrdersPending({ 'instrument_id': instrument_id })//from to order_id ledger_id trade_id
        .then(res => {
            res.forEach((ele) => {
                console.log("init add Pending order to map " + JSON.stringify(ele))
                orderData.set(ele.order_id, ele)
            })
            startWebsocket();
        })
}
/**********  公共信息 start  ***********************/
function startWebsocket() {
    //websocket 初始化
    console.log('spot.......');
    wss.connect();
    wss.on('open', data => {
        console.log("websocket open!!!");
        wss.login(config.httpkey, config.httpsecret, config.passphrase);
    });
    wss.on('message', wsMessage);
    wss.on('close', () => {
        console.log("websocket close reconnect!!!");
        wss.connect();
    });
    innerEvent.on('login', data => {
        (async function () {
            wss.subscribe(channel_ticker + ':' + instrument_id);
            //wss.subscribe(channel_candle1day+':'+instrument_id); 
            wss.subscribe(channel_depth + ':' + instrument_id);
            wss.subscribe(channel_order + ':' + instrument_id);
        }())
    })
    innerEvent.on(channel_ticker, (info => {
        var d = info.data[0];
        if (tickerData) {
            console.log(d.instrument_id + `买一 ` + d.best_bid + ' 卖一 ' + d.best_ask + ' 最新成交价:' + d.last);
        }
        tickerData = d;
    }))
    innerEvent.on(channel_order, (info => {
        var d = info.data[0];
        // console.log("订单情况:"+JSON.stringify(d) );  
        if (d.state == -1) {
            console.log("订单监听:撤单成功---" + JSON.stringify(d.order_id));
        } else if (d.state == 0) {
            console.log("订单监听:等待成交---" + JSON.stringify(d.order_id));
        }

        // if(orderData.has(d.order_id)){
        //    if( d.state ==2){
        //     orderData.delete(d.order_id)
        //    }
        //     //console.log(d.instrument_id+`买一 `+d.best_bid + ' 卖一 ' +d.best_ask + ' 最新成交价:'+d.last  );  
        // }
    }))
    innerEvent.on(channel_depth, (info => {
        var d = info.data[0];
        if (!asks) {
            asks = d.asks;
            bids = d.bids;
        } else {//TODO 监听到盘口买一价格 不是自己的订单 并且有空间就挂个小量订单 需要考虑是否影响其他自动交易
            d.asks.forEach((new_d) => {//卖方从小到大排列
                let index = asks.findIndex(function (local_d) {
                    return new_d[0] <= local_d[0];//价格相同,数量不同则更新
                })
                if (index >= 0) {//如果找到就更新
                    if (new_d[0] == asks[index][0]) {
                        if (new_d[1] == 0) {//数量为0就删除
                            asks.splice(index, 1)
                        } else {
                            asks[index] = new_d;//替换
                        }
                    } else {//没有找到相同价格就插入
                        asks.splice(index, 0, new_d)
                    }

                } else {//卖价最高
                    asks.push(new_d)
                }
            })

            d.bids.forEach((new_d) => {//买方从大到小排列
                let index = bids.findIndex(function (local_d) {
                    return new_d[0] >= local_d[0];//价格相同,数量不同则更新
                })
                if (index == 0) {
                    //有人下单 如果价格不是我们自己买单的价格,就别人下单
                }
                if (index >= 0) {//如果找到就更新
                    if (new_d[0] == bids[index][0]) {
                        if (new_d[1] == 0) {//数量为0就删除
                            bids.splice(index, 1)
                        } else {
                            bids[index] = new_d;//替换
                        }
                    } else {//没有找到相同价格就插入
                        bids.splice(index, 0, new_d)
                    }

                } else {//出价最低
                    bids.push(new_d)
                }
            })
        }
        // console.log("asks update:"+JSON.stringify(d.bids));  
        // console.log("asks深度情况:"+JSON.stringify(bids));  
    }))
}

authClient.spot().getAccounts(currency).then(res => console.log(JSON.stringify(res)));

//websocket 返回消息
function wsMessage(data) {

    var obj = JSON.parse(data);
    var eventType = obj.event;

    if (eventType == 'login') {
        //登录消息
        if (obj.success == true) {
            innerEvent.emit('login');
        }
    } else if (eventType == undefined) {
        //行情消息相关
        innerEvent.emit(obj.table, obj);
        // tableMsg(obj);
    }
}
/**********  公共信息 end  ***********************/

/**********  随机买卖  start  ***********************/

function startMakeOrder() {
    //TODO 获取订单列表 初始化到orderData

    interval_autoMaker = setInterval(() => {
        if (tickerData) {
            // var instrument_id = tickerData.instrument_id
            // var bid = tickerData.best_bid//买一 tickerData.best_ask//卖一
            console.log("interval ---" + tickerData.instrument_id + `买一 ` + tickerData.best_bid + ' 卖一 ' + tickerData.best_ask + ' 最新成交价:' + tickerData.last);
            authClient.spot().postOrder({
                'type': 'limit', 'side': 'buy',
                'instrument_id': instrument_id, 'size': 1, 'client_oid': 'spot123',
                'price': 0.01, 'margin_trading': 1, 'order_type': '1'
            }).then(res => {
                if (res.result && res.order_id) {
                    authClient.spot().getOrder(res.order_id, { 'instrument_id': instrument_id })
                        .then(res => {
                            // console.log(JSON.stringify(res));
                            console.log("下单成功---" + JSON.stringify(res))
                            orderData.set(res.order_id, res);
                        });
                    // console.log("下单成功---"+JSON.stringify(res))
                }
            })
        }
    }, interval_volume)
}
function startTakeOrder() {
    interval_autoTaker = setInterval(() => {
        orderData.forEach((value, key, map) => {
            // console.log("服务器当前时间:"+Date.parse(tickerData.timestamp));
            // console.log("系统当前时间:"+Date.now());
            var t = tickerData.timestamp ? Date.parse(tickerData.timestamp) : Date.now();//系统当前时间或者服务器当前时间
            if (value.state != 2 && t - Date.parse(value.timestamp) > interval_volume) {
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

    }, interval_volume)
}
/**********  随机买卖  end  ***********************/

/**********  批量挂单  start  ***********************/
function getBatchOrder(params, acct) {//只挂单
    //根据价格将单子平均拆分 或者随机拆分
    //价格范围 bprice eprice  买入个数 amount
    //挂单数量 orderCount 平均拆分
    let orderCount = 1;
    let amount = 1;
    let sprice = 1;
    let priceStep = (params.eprice - params.sprice) / orderCount
    let count = amount / orderCount
    let batchOrder = new Array()
    for (var i = 0; i < orderCount; i++) {
        batchOrder.push({
            'type': 'limit', 'side': 'buy',
            'instrument_id': instrument_id, 'size': count,
            'client_oid': 'spot123', //TODO 
            'price': sprice + priceStep * i, 'margin_trading': 1, 'order_type': '0'
        })
    }
    return batchOrder
}
/**********  批量挂单  end  ***********************/

/**********  批量扫单   start  ***********************/
function getDepOrder(params, acct) {
    let toPrice = params.toPrice
    let buyOrSell = params.buyOrSell
    //传入一个目标价格将深度中的单子全部成交
    pClient.spot().getSpotBook(instrument_id, { size: 200 }).then(res => {//需要测试 3种情况,全吃,一个不吃,吃部分
        if (res.asks && res.bids) {
            if (buyOrSell == 'buy' && toPrice > res.asks[0][0]) {//卖一的价格低于设置的底部价格,拉盘
                let takeIndex = asks.findIndex(function (ask) {
                    return toPrice < ask[0];
                })
                let toTake;
                if (takeIndex < 0) {
                    toTake = res.asks
                } else {//TODO 如果没有找到index 则全吃?
                    toTake = res.asks.slice(0, takeIndex)
                }

                let batchOrder = new Array()
                let pre_price = 0;
                toTake.forEach((ele) => {
                    batchOrder.push({
                        'type': 'limit', 'side': 'buy',
                        'instrument_id': instrument_id, 'size': ele[1],//吃单数量与深度一致?
                        'client_oid': 'spot123', //TODO 
                        'price': ele[0], 'margin_trading': 1, 'order_type': '3'
                    }) //立即成交并取消剩余
                    pre_price += ele[0] * ele[1];
                })
                console.log("触发托盘 需要下单:" + JSON.stringify(batchOrder));  //TODO 如果单子的数量大于10个就要拆分
                console.log("预计成本: " + JSON.stringify(pre_price) + ' USDT');
                // authClient.spot().postBatchOrders(JSON.stringify(toTake.slice(0,10)))
            } else if (buyOrSell == 'buy' && toPrice < res.bids[0][0]) {//买一的价格高于设置的顶部价格,压盘
                let takeIndex = bids.findIndex(function (bid) {
                    return toPrice > bid[0];
                })
                let toTake;
                if (takeIndex < 0) {
                    toTake = res.bids
                } else {//TODO 如果没有找到index 则全吃?
                    toTake = res.bids.slice(0, takeIndex)
                }
                let batchOrder = new Array()
                let pre_price = 0;
                toTake.forEach((ele) => {
                    batchOrder.push({
                        'type': 'limit', 'side': 'sell',
                        'instrument_id': instrument_id, 'size': ele[1],//吃单数量与深度一致?
                        'client_oid': 'spot123', //TODO 
                        'price': ele[0], 'margin_trading': 1, 'order_type': '3'
                    }) //立即成交并取消剩余
                    pre_price += ele[0] * ele[1];
                })
                console.log("触发压盘 需要下单:" + JSON.stringify(batchOrder));  //TODO 如果单子的数量大于10个就要拆分
                console.log("预计成本: " + JSON.stringify(pre_price) + ' USDT');
            }
        }
    })
}
/**********  批量扫单   end  ***********************/

export = {
    setAutoTrade,
    startAutoTrade,
    stopAutoTrade,
    innerEvent
}