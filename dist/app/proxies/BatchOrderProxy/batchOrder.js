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
const config = require('../../config');
const acctInfo2_1 = __importDefault(require("../../acctInfo2"));
const PageInfo_1 = __importDefault(require("../../PageInfo"));
const { AuthenticatedClient } = require('@okfe/okex-node');
const { PublicClient } = require('@okfe/okex-node');
const sqlite3_1 = __importDefault(require("../../../sqlite3"));
const DbOrders_1 = require("../../DbOrders");
//let acctinfo;
//批量挂单   生成订单  ------------------------------- batchOrder.js
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
 * instrument_id
 * }
  return 一个对象
 * }
 */
function genBatchOrder(params, acct) {
    return __awaiter(this, void 0, void 0, function* () {
        //根据价格将单子平均拆分 或者随机拆分
        //价格范围 bprice eprice  买入个数 amount
        //挂单数量 orderCount 平均拆分
        console.log("params:" + JSON.stringify(params));
        let orderCount = (params.topPrice - params.startPrice) / (params.startPrice * params.incr);
        let batchOrder = new Array();
        let cost = 0;
        let sizes = new Array(); //订单数量 从小到大
        let prices = new Array(); //价格 从小到大
        for (let i = 0; i < orderCount; i++) {
            sizes.push(params.size * (1 + params.sizeIncr * i));
        }
        for (let i = 0; i < orderCount; i++) {
            prices.push(params.startPrice + (params.startPrice * params.incr) * i);
        }
        //  console.log("订单---sizes" +sizes)//
        // console.log("订单---prices"+prices)
        var side;
        if (params.type == 1) { //买入   数量从高到低
            sizes.reverse();
            side = 'buy';
        }
        else if (params.type == 2) { //卖出   数量从低到高
            side = 'sell';
        }
        for (let i = 0; i < orderCount; i++) {
            let order = {
                'type': 'limit', 'side': side,
                'instrument_id': params.instrument_id, 'size': sizes[i],
                'client_oid': config.orderType.batchOrder + Date.now() + 'X' + i,
                'price': prices[i].toFixed(4), 'margin_trading': 1, 'order_type': '0'
            };
            batchOrder.push(order);
            cost += parseFloat(order.price) * order.size;
        }
        return {
            result: true,
            orders: batchOrder,
            cost
        };
    });
}
/**
 * 接口:
 * params:
 * {
 * orders
 * }
 * acct:account
  return 一个对象
 * }
 */
function toBatchOrder(params, acct) {
    return __awaiter(this, void 0, void 0, function* () {
        let batchOrder = params.orders;
        const authClient = new AuthenticatedClient(acct.httpkey, acct.httpsecret, acct.passphrase, config.urlHost);
        const order_db = new DbOrders_1.DbOrders(sqlite3_1.default.getInstance().Sqlite3Handler, acct);
        try {
            for (let j = 0; j < batchOrder.length; j += 10) {
                let tmp = batchOrder.slice(j, j + 10);
                let res = yield authClient.spot().postBatchOrders(tmp);
                let ins = params.instrument_id.toLowerCase();
                for (let i = 0; i < res[ins].length; i++) {
                    if (res[ins][i].order_id != -1) {
                        res[ins][i].instrument_id = params.instrument_id;
                        order_db.addBatchOrder(res[ins][i]);
                    }
                }
                yield sleep(50); //每秒20次 限制是每2秒50次
                console.log("订单tmp---" + JSON.stringify(res)); //
            }
            //   console.log('orderCount ' + orderCount + 'cost:' + cost)
        }
        catch (e) {
            console.log(e);
            return {
                result: false,
                error_message: e + ''
            };
        }
        return {
            result: true
        };
    });
}
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
//批量撤单
/****
  * params:
 * {
 * type   //1 买入  2 卖出
 * topPrice  //交易最高价
 * startPrice //交易最低价
 * instrument_id
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
function cancelBatchOrder(params, acct) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("params:" + JSON.stringify(params));
        const authClient = new AuthenticatedClient(acct.httpkey, acct.httpsecret, acct.passphrase, config.urlHost);
        let failed = new Array();
        let start = true;
        let from;
        let limit = 100;
        while (start) {
            let res;
            try {
                if (from) {
                    res = yield authClient.spot().getOrdersPending({ 'instrument_id': params.instrument_id, 'limit': limit, 'from': from });
                }
                else {
                    res = yield authClient.spot().getOrdersPending({ 'instrument_id': params.instrument_id, 'limit': limit });
                }
                // orderData = orderData.concat(res)
                let order_ids = [];
                res.forEach(function (ele) {
                    console.log("价格和id" + ele.price + "---" + ele.order_id);
                    if (params.startPrice <= ele.price && params.topPrice >= ele.price) {
                        order_ids.push(ele.order_id);
                    }
                    else if (params.startPrice == 0 && params.topPrice == 0) {
                        order_ids.push(ele.order_id);
                    }
                });
                //console.log("应该撤消的订单为" + JSON.stringify(order_ids))
                if (order_ids.length > 0) {
                    try {
                        for (let j = 0; j < order_ids.length; j += 10) {
                            let tmp = order_ids.slice(j, j + 10);
                            let result = yield authClient.spot().postCancelBatchOrders([{ 'instrument_id': params.instrument_id, 'order_ids': tmp }]);
                            yield sleep(50); //每秒20次 限制是每2秒50次
                            console.log("撤消订单tmp---" + JSON.stringify(result)); //
                        }
                        //  console.log('orderCount ' + orderCount + 'cost:' + cost)
                    }
                    catch (e) {
                        console.log(e);
                        return {
                            result: false,
                            error_message: e + ''
                        };
                    }
                }
                if (res.length > 0) {
                    from = res[res.length - 1].order_id;
                }
                //  await sleep(100);//每秒10次 限制是每2秒20次
                if (res.length < limit) {
                    start = false;
                }
            }
            catch (e) {
                console.log(e);
                return {
                    result: false,
                    error_message: e + ''
                };
            }
        }
        return {
            result: true
        };
    });
}
//冰山委托
/****
  * params:
 * {
 * type   //1 买入  2 卖出
 * depth  //深度
 * size //数量
 * perSize //单笔数量
 * priceLimit //价格限制
 * instrument_id
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
// function icebergOrder(params, acct) {
//     //var pci = acctInfo(acct.httpkey, acct.httpsecret, acct.passphrase);
//     var pci = new AccountInfo(params.instrument_id, params.httpkey, params.httpsecret, params.passphrase);
//     pci.event.on(config.channel_ticker, (info => {
//         var d = info.data[0];
//         console.log(d.instrument_id + `买一  ` + d.best_bid + ' 卖一 ' + d.best_ask + ' 最新成交价======:' + d.last);
//     }))
//     var interval_autoMaker = setInterval(() => {
//         if (pci.tickerData) {
//             // var instrument_id = tickerData.instrument_id
//             // var bid = tickerData.best_bid//买一 tickerData.best_ask//卖一
//             console.log("interval ---" + pci.tickerData.instrument_id + `买一 ` + pci.tickerData.best_bid + ' 卖一 ' + pci.tickerData.best_ask + ' 最新成交价:' + pci.tickerData.last);
//             // authClient.spot().postOrder({
//             //     'type': 'limit', 'side': 'buy',
//             //     'instrument_id': params.instrument_id, 'size': 1, 'client_oid': 'spot123',
//             //     'price': 0.01, 'margin_trading': 1, 'order_type': '1'
//             // }).then(res => {
//             //     if (res.result && res.order_id) {
//             //         authClient.spot().getOrder(res.order_id, { 'instrument_id': params.instrument_id })
//             //             .then(res => {
//             //                 // console.log(JSON.stringify(res));
//             //                 console.log("下单成功---" + JSON.stringify(res))
//             //                 orderData.set(res.order_id, res);
//             //             });
//             //         // console.log("下单成功---"+JSON.stringify(res))
//             //     }
//             // })
//         } else {
//             console.log("无法获取当前盘口价格!")
//         }
//     }, 5000)
// }
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
function limitOrder(params, acct) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("params:" + JSON.stringify(params));
        const authClient = new AuthenticatedClient(acct.httpkey, acct.httpsecret, acct.passphrase, config.urlHost);
        const order_db = new DbOrders_1.DbOrders(sqlite3_1.default.getInstance().Sqlite3Handler, acct);
        var side;
        if (params.type == 1) { //买入   
            side = 'buy';
        }
        else if (params.type == 2) { //卖出  
            side = 'sell';
        }
        let order = {
            'type': 'limit', 'side': side,
            'instrument_id': params.instrument_id, 'size': params.size,
            'client_oid': config.orderType.limitOrder + Date.now(),
            'price': params.price, 'margin_trading': 1, 'order_type': '0'
        };
        let result = yield authClient.spot().postOrder(order);
        let o = yield authClient.spot().getOrder(result.order_id, { 'instrument_id': params.instrument_id });
        let db_r = order_db.add(o);
        let odb = order_db.getOrderByOrderId(o.order_id);
        //  let o = await authClient.spot().getOrder(result.order_id, { 'instrument_id': params.instrument_id });
        // let o = order_db.getOrderByOrderId('2981516814196736')
        // o[0].order_id = '2981516814196736';
        // o[0].state = '1000'
        // o[0].notional = '000'
        // let result = order_db.updateAllInfo(o[0])
        // let db_r = order_db.add(o);
        // let sql2 = `update orders set state=$state where order_id=$order_id`
        // let res2 = order_db.update(sql2, { state: '100', order_id: o.order_id })
        console.log(JSON.stringify(odb));
        return result;
    });
}
/***
 * params:
 * {
 * type   //1 买入  2 卖出
 * notional  //买入时的金额
 * size //数量  卖出时的数量
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
function marketOrder(params, acct) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("params:" + JSON.stringify(params));
        const authClient = new AuthenticatedClient(acct.httpkey, acct.httpsecret, acct.passphrase, config.urlHost);
        const order_db = new DbOrders_1.DbOrders(sqlite3_1.default.getInstance().Sqlite3Handler, acct);
        let order;
        if (params.type == 1) { //买入   
            order = {
                'type': 'market', 'side': 'buy',
                'instrument_id': params.instrument_id,
                'client_oid': config.orderType.marketOrder + Date.now(),
                'notional': params.notional, 'margin_trading': 1, 'order_type': '0'
            };
        }
        else if (params.type == 2) { //卖出  
            order = {
                'type': 'market', 'side': 'sell',
                'instrument_id': params.instrument_id, 'size': params.size,
                'client_oid': config.orderType.marketOrder + Date.now(),
                'margin_trading': 1, 'order_type': '0'
            };
        }
        let result = yield authClient.spot().postOrder(order);
        let o = yield authClient.spot().getOrder(result.order_id, { 'instrument_id': params.instrument_id });
        let db_r = order_db.add(o);
        console.log(result);
        return result;
    });
}
/***
 * {
 * params:
 * instrument_id
 * channel
 * }
 */
function pageInfo(params) {
    return __awaiter(this, void 0, void 0, function* () {
        let p = PageInfo_1.default.initPageInfo(params);
        return p;
    });
}
/***
 * {
 * params:
 * instrument_id
 * channel
 * }
 */
function pageKline(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            PageInfo_1.default.subscribeKline(params);
        }
        catch (error) {
            console.log(error);
            return {
                result: false,
                error_message: error
            };
        }
        return {
            result: true
        };
    });
}
/***
 * params:
 * {
 * instrument_id
 * httpkey
 * httpsecret
 * passphrase
 * }
 */
function startDepInfo(params) {
    return __awaiter(this, void 0, void 0, function* () {
        let acctinfo = acctInfo2_1.default.acctInfo(params);
        return acctinfo;
    });
}
/***
 * params:
 * {
 * instrument_id
 * httpkey
 * httpsecret
 * passphrase
 * }
 */
function stopDepInfo(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //acctinfo.wss.close();
            acctInfo2_1.default.stopWebsocket(params);
        }
        catch (error) {
            console.log(error);
            return {
                result: false,
                error_message: error
            };
        }
        return {
            result: true
        };
    });
}
// async function startDepInfo(acct) {
//     return acctInfo(acct.httpkey, acct.httpsecret, acct.passphrase)
// }
/***
 * params:
 * {
 * instrument_id
 * from
 * to
 * limit 订单状态("-2":失败,"-1":撤单成功,"0":等待成交 ,"1":部分成交, "2":完全成交,"3":下单中,"4":撤单中,"6": 未完成（等待成交+部分成交），"7":已完成（撤单成功+完全成交））
 * state
 * }
 * acct:
 * {
 * name
 * httpkey
 * httpsecret
 * passphrase
 * }
 */
function getOrderData(params, acct) {
    return __awaiter(this, void 0, void 0, function* () {
        const authClient = new AuthenticatedClient(acct.httpkey, acct.httpsecret, acct.passphrase, config.urlHost);
        params.state = 2;
        let result;
        try {
            result = yield authClient.spot().getOrders(params);
        }
        catch (error) {
            console.log(error);
            return {
                result: false,
                error_message: error + ''
            };
        }
        // result.length = result[0].length
        // console.log(result)
        return {
            list: result,
            length: result ? result.length : 0
        };
    });
}
function getTradeData(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const pclient = new PublicClient(config.urlHost);
        let result;
        try {
            result = yield pclient.spot().getSpotTrade(params.instrument_id, params);
        }
        catch (error) {
            console.log(error);
            return {
                result: false,
                error_message: error + ''
            };
        }
        return {
            result
        };
    });
}
function getCandlesData(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const pclient = new PublicClient(config.urlHost);
        let result;
        try {
            result = yield pclient.spot().getSpotCandles(params.instrument_id, params);
        }
        catch (error) {
            console.log(error);
            return {
                result: false,
                error_message: error + ''
            };
        }
        return {
            result
        };
    });
}
function freshOrderInfo(params, acct) {
    return __awaiter(this, void 0, void 0, function* () {
        const authClient = new AuthenticatedClient(acct.httpkey, acct.httpsecret, acct.passphrase, config.urlHost);
        let sql = `select * from orders where state != $state;`;
        const order_db = new DbOrders_1.DbOrders(sqlite3_1.default.getInstance().Sqlite3Handler, acct);
        let res = order_db.getOrders(sql, { state: '2' });
        try {
            for (var i = 0; i < res.length; i++) {
                let o = yield authClient.spot().getOrder(res[i].order_id, { 'instrument_id': params.instrument_id });
                if (o.length == 1) {
                    order_db.updateAllInfo(o[0]);
                }
                yield sleep(100);
            }
        }
        catch (error) {
            console.log(error);
            return {
                result: false,
                error_message: error
            };
        }
        return {
            result: true
        };
    });
}
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
function startMaker(params, acct) {
    return __awaiter(this, void 0, void 0, function* () {
        acct.instrument_id = params.instrument_id;
        let acctinfo = acctInfo2_1.default.acctInfo(acct);
        acctinfo.startAutoMaker(params);
        return acctinfo;
    });
}
// console.log(genBatchOrder({type:2,topPrice:0.04,startPrice:0.03,incr:0.2,size:1,sizeIncr:1},
//     {httpkey:config.httpkey,httpsecret:config.httpsecret,passphrase:config.passphrase}))
//cancelBatchOrder({startPrice:0.01,topPrice:0.02},{httpkey:config.httpkey,httpsecret:config.httpsecret,passphrase:config.passphrase})
// limitOrder({type:1,price:0.01,size:1},
//        {httpkey:config.httpkey,httpsecret:config.httpsecret,passphrase:config.passphrase})
// marketOrder({type:1,notional:1},
//       {httpkey:config.httpkey,httpsecret:config.httpsecret,passphrase:config.passphrase})
// marketOrder({type:2,size:1},
//    {httpkey:config.httpkey,httpsecret:config.httpsecret,passphrase:config.passphrase})
exports.default = {
    genBatchOrder,
    toBatchOrder,
    cancelBatchOrder,
    limitOrder,
    marketOrder,
    startDepInfo,
    stopDepInfo,
    getOrderData,
    pageInfo,
    pageKline,
    getTradeData,
    getCandlesData
};
