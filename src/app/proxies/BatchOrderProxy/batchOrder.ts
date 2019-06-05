const config = require('../../config');
import acctInfo from "../../acctInfo";
const { AuthenticatedClient } = require('@okfe/okex-node');

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
 * }
  return 一个对象
 * }
 */
async function genBatchOrder(params, acct) {//TODO 注意价格限制
    //根据价格将单子平均拆分 或者随机拆分
    //价格范围 bprice eprice  买入个数 amount
    //挂单数量 orderCount 平均拆分
    const authClient = new AuthenticatedClient(acct.httpkey,
        acct.httpsecret, acct.passphrase, config.urlHost);
    let orderCount = (params.topPrice - params.startPrice) / (params.startPrice * params.incr)
    let batchOrder = new Array()
    let cost = 0;
    let sizes = new Array()//订单数量 从小到大
    let prices = new Array()//价格 从小到大
    for (let i = 0; i < orderCount; i++) {
        sizes.push(params.size * (1 + params.sizeIncr * i))
    }
    for (let i = 0; i < orderCount; i++) {
        prices.push(params.startPrice + (params.startPrice * params.incr) * i)
    }
    //  console.log("订单---sizes" +sizes)//
    // console.log("订单---prices"+prices)
    var side;
    if (params.type == 1) {//买入   数量从高到低
        sizes.reverse()
        side = 'buy'
    } else if (params.type == 2) {//卖出   数量从低到高
        side = 'sell'
    }

    for (let i = 0; i < orderCount; i++) {
        let order = {
            'type': 'limit', 'side': side,
            'instrument_id': config.instrument_id, 'size': sizes[i],
            'client_oid': config.orderType.batchOrder + Date.now() , //TODO 注意限价
            'price': prices[i], 'margin_trading': 1, 'order_type': '0'
        }
        batchOrder.push(order);
        cost += order.price * order.size;
    }
    console.log("订单---" + JSON.stringify(batchOrder))//
    try {
        for (let j = 0; j < batchOrder.length; j += 10) {
            let tmp = batchOrder.slice(j, j + 10)
            let res = await  authClient.spot().postBatchOrders(tmp);
            await sleep(50);//每秒20次 限制是每2秒50次
            console.log("订单tmp---" + JSON.stringify(res))//
        }
        console.log('orderCount ' + orderCount + 'cost:' + cost)
    } catch (e) {
        console.log(e)
        return {
            result:false,
            error_message: e+''
        }
    }

    return {
        result:true,
        orders: batchOrder,
        cost
    }
    //     return {orders:[{'type': 'limit', 'side': 'buy', 'instrument_id': 'BTC-USDT', 'size': 0.001, 'client_oid': 'oktspot79', 'price': '4638.51', 'funds': '', 'margin_trading': '1', 'order_type': '3'}],
    //     cost:1000
    //  }
}
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}
//批量撤单
/****
  * params:
 * {
 * type   //1 买入  2 卖出
 * topPrice  //交易最高价
 * startPrice //交易最低价
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

async function cancelBatchOrder(params, acct) {
    const authClient = new AuthenticatedClient(acct.httpkey,
        acct.httpsecret, acct.passphrase, config.urlHost);
    let failed = new Array();
    let start = true
    let from;
    let limit = 100
    while (start) {
        let res
        try {
            if (from) {
                res = await authClient.spot().getOrdersPending({ 'instrument_id': config.instrument_id, 'limit': limit, 'from': from });
            } else {
                res = await authClient.spot().getOrdersPending({ 'instrument_id': config.instrument_id, 'limit': limit });
            }
           // orderData = orderData.concat(res)
            let order_ids = []
            res.forEach(function (ele) {
                console.log("价格和id" + ele.price + "---" + ele.order_id)
                if (params.startPrice <= ele.price && params.topPrice >= ele.price) {
                    order_ids.push(ele.order_id)
                }
            })
            //console.log("应该撤消的订单为" + JSON.stringify(order_ids))
            if (order_ids.length > 0) {
                try {
                    for (let j = 0; j < order_ids.length; j += 10) {
                        let tmp = order_ids.slice(j, j + 10)
                        let result = await authClient.spot().postCancelBatchOrders([{ 'instrument_id': config.instrument_id, 'order_ids': tmp }]);
                        await sleep(50);//每秒20次 限制是每2秒50次
                        console.log("撤消订单tmp---" + JSON.stringify(result))//
                    }
                  //  console.log('orderCount ' + orderCount + 'cost:' + cost)
                } catch (e) {
                    console.log(e)
                    return {
                        result:false,
                        error_message: e+''
                    }
                }
              
            }
            if (res.length > 0) {
                from = res[res.length - 1].order_id
            }
          //  await sleep(100);//每秒10次 限制是每2秒20次
            if (res.length < limit) {
                start = false;
            }
        } catch (e) {
            console.log(e)
            return {
                result:false,
                error_message: e+''}
        }
    }

    return {
        result:true      
    }
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
//     var pci =  acctInfo(acct.httpkey,acct.httpsecret,acct.passphrase);
//     var interval_autoMaker = setInterval(() => {
//         if (pci.tickerData) {
//             // var instrument_id = tickerData.instrument_id
//             // var bid = tickerData.best_bid//买一 tickerData.best_ask//卖一
//             console.log("interval ---" + pci.tickerData.instrument_id + `买一 ` + pci.tickerData.best_bid + ' 卖一 ' + pci.tickerData.best_ask + ' 最新成交价:' + pci.tickerData.last);
//             // authClient.spot().postOrder({
//             //     'type': 'limit', 'side': 'buy',
//             //     'instrument_id': config.instrument_id, 'size': 1, 'client_oid': 'spot123',
//             //     'price': 0.01, 'margin_trading': 1, 'order_type': '1'
//             // }).then(res => {
//             //     if (res.result && res.order_id) {
//             //         authClient.spot().getOrder(res.order_id, { 'instrument_id': config.instrument_id })
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
async function limitOrder(params, acct){
    const authClient = new AuthenticatedClient(acct.httpkey,
        acct.httpsecret, acct.passphrase, config.urlHost);
        var side;
        if (params.type == 1) {//买入   
            side = 'buy'
        } else if (params.type == 2) {//卖出  
            side = 'sell'
        }
        let order = {
            'type': 'limit', 'side': side,
            'instrument_id': config.instrument_id, 'size':params.size,
            'client_oid': config.orderType.limitOrder + Date.now() ,
            'price': params.price, 'margin_trading': 1, 'order_type': '0'
        }
      let result = await authClient.spot().postOrder(order);
      console.log(result)
      return result
}
/***
 * params:
 * {
 * type   //1 买入  2 卖出
 * notional  //买入时的金额
 * size //数量  卖出时的数量
 * }
 * acct:
 * {
 * name 
 * httpkey
 * httpsecret
 * passphrase
 * }
 */
async function marketOrder(params, acct){
    const authClient = new AuthenticatedClient(acct.httpkey,
        acct.httpsecret, acct.passphrase, config.urlHost);
        let order ;
        if (params.type == 1) {//买入   
            order = {
                'type': 'market', 'side': 'buy',
                'instrument_id': config.instrument_id, 
                'client_oid': config.orderType.marketOrder + Date.now() , 
                'notional': params.notional, 'margin_trading': 1, 'order_type': '0'
            }
        } else if (params.type == 2) {//卖出  
            order = {
                'type': 'market', 'side': 'sell',
                'instrument_id': config.instrument_id, 'size':params.size,
                'client_oid': config.orderType.marketOrder + Date.now() , 
                 'margin_trading': 1, 'order_type': '0'
            }
        }
       
      let result = await authClient.spot().postOrder(order);
      console.log(result)
      return result
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
export default {
    genBatchOrder,
    cancelBatchOrder,
    limitOrder,
    marketOrder
}