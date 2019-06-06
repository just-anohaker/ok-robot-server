var EventEmitter = require('events').EventEmitter;
const { PublicClient } = require('@okfe/okex-node');
const { V3WebsocketClient } = require('@okfe/okex-node');
const { AuthenticatedClient } = require('@okfe/okex-node');
var config = require('./config');
var self

//let _instance = undefined;
export default function acctInfo(httpkey, httpsecret, passphrase) {
    // if (_instance === undefined) {
    let _instance = undefined;
    _instance = {};
    _instance.httpkey = httpkey;
    _instance.httpsecret = httpsecret;
    _instance.passphrase = passphrase;
    _instance.tickerData;
    _instance.bids;
    _instance.asks;
    _instance.isClosed;
    _instance.pendingOrders = new Map();
    _instance.orderPrice = new Map();
    _instance.wss = new V3WebsocketClient(config.websocekHost);
    _instance.pClient = new PublicClient(config.urlHost);
    _instance.authClient = new AuthenticatedClient(httpkey,
        httpsecret, passphrase);
    _instance.event = new EventEmitter();
    self = _instance
    startWebsocket();
    //}
    return _instance;
}
async function initOrderData() {
    let start = true;
    let limit = 100;
    let from
    // 初始化 订单
    while (start) {
        let res
        try {
            if (from) {
                res = await self.authClient.spot().getOrdersPending({ 'instrument_id': config.instrument_id, 'limit': limit, 'from': from });
            } else {
                res = await self.authClient.spot().getOrdersPending({ 'instrument_id': config.instrument_id, 'limit': limit });
            }

            res.forEach(function (ele) {
                console.log("挂单:" + ele.price + "---" + ele.size)
                self.pendingOrders.set(ele.order_id, ele);
                // if(!self.pendingOrders.has(ele.order_id )){
                //     self.pendingOrders.set(ele);
                // }
            })
            if (res.length > 0) {
                from = res[res.length - 1].order_id
            }
            await sleep(100);//每秒10次 限制是每2秒20次
            if (res.length < limit) {
                start = false;
            }
        } catch (e) {
            console.log(e)
            return {
                result: false,
                error_message: e + ''
            }
        }
    }
    self.wss.login(self.httpkey, self.httpsecret, self.passphrase);
}
function stopWebsocket() {
    self.wss.close();
}
function startWebsocket() {
    console.log('spot.......');
    self.wss.connect();
    self.wss.on('open', data => {
        console.log("websocket open!!!");
        initOrderData();

    });
    self.wss.on('message', wsMessage);
    self.wss.on('close', () => {
        self.isClosed = true
    });
    self.event.on('login', data => {
        (async function () {
            self.wss.subscribe(config.channel_order + ':' + config.instrument_id);
            self.wss.subscribe(config.channel_ticker + ':' + config.instrument_id);
            self.wss.subscribe(config.channel_depth + ':' + config.instrument_id);
        }())
    })
    self.event.on(config.channel_order, (info => {
        var d = info.data[0];
        // console.log("订单情况:"+JSON.stringify(d) );  
        // if(d.state == -1 ){
        //     console.log("订单监听:撤单成功---"+JSON.stringify(d.order_id) );  
        // }else if(d.state == 0 ){
        //     console.log("订单监听:等待成交---"+JSON.stringify(d.order_id) );  
        // }

        if (self.pendingOrders.has(d.order_id)) {
            if (d.state == -1 || d.state == 2) {//撤单成功或者完全成交
                self.pendingOrders.delete(d.order_id)
            } else if (d.state == 0 || d.state == 1) {//部分成交或者等待成交的单子
                self.pendingOrders.set(d.order_id, d)
            }
            //console.log(d.instrument_id+`买一 `+d.best_bid + ' 卖一 ' +d.best_ask + ' 最新成交价:'+d.last  );  
        }

        //orderPrice.set()
    }))
    self.event.on(config.channel_depth, (info => {
        var d = info.data[0];
        if (!self.asks) {
            self.asks = d.asks;
            self.bids = d.bids;
        } else {//TODO 监听到盘口买一价格 不是自己的订单 并且有空间就挂个小量订单 需要考虑是否影响其他自动交易
            d.asks.forEach((new_d) => {//卖方从小到大排列
                let index = self.asks.findIndex(function (local_d) {
                    return new_d[0] <= local_d[0];//价格相同,数量不同则更新
                })
                if (index >= 0) {//如果找到就更新
                    if (new_d[0] == self.asks[index][0]) {
                        if (new_d[1] == 0) {//数量为0就删除
                            self.asks.splice(index, 1)
                        } else {
                            self.asks[index] = new_d;//替换
                        }
                    } else {//没有找到相同价格就插入
                        self.asks.splice(index, 0, new_d)
                    }

                } else {//卖价最高
                    self.asks.push(new_d)
                }
            })

            d.bids.forEach((new_d) => {//买方从大到小排列
                let index = self.bids.findIndex(function (local_d) {
                    return new_d[0] >= local_d[0];//价格相同,数量不同则更新
                })
                if (index >= 0) {//如果找到就更新
                    if (new_d[0] == self.bids[index][0]) {
                        if (new_d[1] == 0) {//数量为0就删除
                            self.bids.splice(index, 1)
                        } else {
                            self.bids[index] = new_d;//替换
                        }
                    } else {//没有找到相同价格就插入
                        self.bids.splice(index, 0, new_d)
                    }

                } else {//出价最低
                    self.bids.push(new_d)
                }
            })
        }
        self.orderPrice.clear();
        //合并订单价格
        for (var order of self.pendingOrders.values()) {
            if (self.orderPrice.has(order.price)) {
                self.orderPrice.set(order.price, self.orderPrice.get(order.price) + (order.size - order.filled_size))
            } else {
                self.orderPrice.set(order.price, (order.size - order.filled_size))
            }
        }
        //将订单的数据合并到深度信息中
        let tem_a = self.asks.slice();
        let tem_b = self.bids.slice();
        tem_a.forEach((element, index, array) => {
            if (self.orderPrice.has(element[0])) {
                array[index].push(self.orderPrice.get(element[0]))
            }
        })
        tem_b.forEach((element, index, array) => {
            if (self.orderPrice.has(element[0])) {
                array[index].push(self.orderPrice.get(element[0]))
            }
        })
        self.event.emit("depth", {
            "asks": tem_a,
            "bids": tem_b
        });
        //console.log("depth:", d)
        //console.log("tem_b:",tem_b)
    }))
}

//websocket 返回消息
function wsMessage(data) {

    var obj = JSON.parse(data);
    var eventType = obj.event;

    if (eventType == 'login') {
        //登录消息
        if (obj.success == true) {
            self.event.emit('login');
        }
    } else if (eventType == undefined) {
        //行情消息相关
        self.event.emit(obj.table, obj);
        // tableMsg(obj);
    }
}
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}
function orderMonitor() {//订单api限制 每2秒20次
    //将所有的订单都获取缓存,循环执行订单的自动撤消 
    //1.订单的tradeid 标记规则:要能分辨订单类型,订单时间,订单发起者
    //2.如果是刷量的订单
    //3.如果是刷量的订单时间大于多少就需要自动撤消
    //4.如果是批量交易的单子需要如何清理?
}
