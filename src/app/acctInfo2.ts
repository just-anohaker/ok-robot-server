import { EventEmitter } from "events";
const { PublicClient } = require('@okfe/okex-node');
const { V3WebsocketClient } = require('@okfe/okex-node');
const { AuthenticatedClient } = require('@okfe/okex-node');
var config = require('./config');
let accouts = new Map();
function acctInfo(pamams): AccountInfo {
    if (accouts.has(pamams.instrument_id + pamams.httpkey)) {
        return accouts.get(pamams.instrument_id + pamams.httpkey)
    }
    var ac = new AccountInfo(pamams.instrument_id, pamams.httpkey, pamams.httpsecret, pamams.passphrase);

    ac.event.on(config.channel_ticker, (info => {
        var d = info.data[0];
        console.log(d.instrument_id + `买一  ` + d.best_bid + ' 卖一 ' + d.best_ask + ' 最新成交价======:' + d.last);
    }))
    accouts.set(pamams.instrument_id + pamams.httpkey, ac);
    ac.startWebsocket();
    return ac
}
function stopWebsocket(pamams) {
    if (accouts.has(pamams.instrument_id + pamams.httpkey)) {
        accouts.get(pamams.instrument_id + pamams.httpkey).stopWebsocket();
        accouts.delete(pamams.instrument_id + pamams.httpkey)
    }
}
export class AccountInfo {
    public event: EventEmitter;
    private httpkey: any;
    private httpsecret: any;
    private passphrase: any;
    private instrument_id: any;
    private tickerData: any;
    private asks: any;
    private bids: any;
    private isClosed: any;
    private pendingOrders: any;
    private orderPrice: any;
    private wss: any;
    private pClient: any;
    private authClient: any;
    constructor(instrument_id, httpkey, httpsecret, passphrase) {
        this.httpkey = httpkey;
        this.httpsecret = httpsecret;
        this.passphrase = passphrase;
        this.instrument_id = instrument_id
        this.tickerData;
        this.bids;
        this.asks;
        this.isClosed;
        this.pendingOrders = new Map();
        this.orderPrice = new Map();
        this.event = new EventEmitter();
        this.wss = new V3WebsocketClient(config.websocekHost);
        this.pClient = new PublicClient(config.urlHost);
        this.authClient = new AuthenticatedClient(httpkey,
            httpsecret, passphrase);
    }
    async  initOrderData() {
        let start = true;
        let limit = 100;
        let from
        // 初始化 订单
        while (start) {
            let res
            try {
                if (from) {
                    res = await this.authClient.spot().getOrdersPending({ 'instrument_id': this.instrument_id, 'limit': limit, 'from': from });
                } else {
                    res = await this.authClient.spot().getOrdersPending({ 'instrument_id': this.instrument_id, 'limit': limit });
                }

                res.forEach((ele) => {
                    console.log("未完成订单:" + ele.price + "---" + ele.size)
                    this.pendingOrders.set(ele.order_id, ele);
                    // if(!this.pendingOrders.has(ele.order_id )){
                    //     this.pendingOrders.set(ele);
                    // }
                })
                if (res.length > 0) {
                    from = res[res.length - 1].order_id
                }
                await this.sleep(100);//每秒10次 限制是每2秒20次
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
        this.wss.login(this.httpkey, this.httpsecret, this.passphrase);
    }
    stopWebsocket() {
        this.wss.close();
    }

    startWebsocket() {
        console.log('spot.......');
        let sendDepthTime = undefined;
        this.wss.connect();
        this.wss.on('open', data => {
            console.log("websocket open!!!");
            this.initOrderData();

        });
        this.wss.on('message', data => {

            var obj = JSON.parse(data);
            var eventType = obj.event;
            if (eventType == 'login') {
                //登录消息
                if (obj.success == true) {
                    this.event.emit('login');
                }
            } else if (eventType == undefined) {
                //行情消息相关
                this.event.emit(obj.table, obj);
                // tableMsg(obj);
            }
        });
        this.wss.on('close', () => {
            this.isClosed = true
        });

        this.event.on('login', data => {
            console.log("websocket login!!!");
            this.wss.subscribe(config.channel_order + ':' + this.instrument_id);
            this.wss.subscribe(config.channel_ticker + ':' + this.instrument_id);
            this.wss.subscribe(config.channel_depth + ':' + this.instrument_id);
        })
        this.event.on(config.channel_order, (info => {
            var d = info.data[0];
            // console.log("订单情况:"+JSON.stringify(d) );  
            // if(d.state == -1 ){
            //     console.log("订单监听:撤单成功---"+JSON.stringify(d.order_id) );  
            // }else if(d.state == 0 ){
            //     console.log("订单监听:等待成交---"+JSON.stringify(d.order_id) );  
            // }

            if (this.pendingOrders.has(d.order_id)) {
                if (d.state == -1 || d.state == 2) {//撤单成功或者完全成交
                    this.pendingOrders.delete(d.order_id)
                } else if (d.state == 0 || d.state == 1) {//部分成交或者等待成交的单子
                    this.pendingOrders.set(d.order_id, d)
                }
                //console.log(d.instrument_id+`买一 `+d.best_bid + ' 卖一 ' +d.best_ask + ' 最新成交价:'+d.last  );  
            }

            //orderPrice.set()
        }))
        this.event.on(config.channel_depth, (info => {
            var d = info.data[0];
            if (!this.asks) {
                this.asks = d.asks;
                this.bids = d.bids;
            } else {//TODO 监听到盘口买一价格 不是自己的订单 并且有空间就挂个小量订单 需要考虑是否影响其他自动交易
                d.asks.forEach((new_d) => {//卖方从小到大排列
                    let index = this.asks.findIndex(function (local_d) {
                        return new_d[0] <= local_d[0];//价格相同,数量不同则更新
                    })
                    if (index >= 0) {//如果找到就更新
                        if (new_d[0] == this.asks[index][0]) {
                            if (new_d[1] == 0) {//数量为0就删除
                                this.asks.splice(index, 1)
                            } else {
                                this.asks[index] = new_d;//替换
                            }
                        } else {//没有找到相同价格就插入
                            this.asks.splice(index, 0, new_d)
                        }

                    } else {//卖价最高
                        this.asks.push(new_d)
                    }
                })

                d.bids.forEach((new_d) => {//买方从大到小排列
                    let index = this.bids.findIndex(function (local_d) {
                        return new_d[0] >= local_d[0];//价格相同,数量不同则更新
                    })
                    if (index >= 0) {//如果找到就更新
                        if (new_d[0] == this.bids[index][0]) {
                            if (new_d[1] == 0) {//数量为0就删除
                                this.bids.splice(index, 1)
                            } else {
                                this.bids[index] = new_d;//替换
                            }
                        } else {//没有找到相同价格就插入
                            this.bids.splice(index, 0, new_d)
                        }

                    } else {//出价最低
                        this.bids.push(new_d)
                    }
                })
            }


            if (sendDepthTime == undefined || Date.now() - sendDepthTime > config.SendDepTime) {
                this.orderPrice.clear();
                //合并订单价格
                for (var order of this.pendingOrders.values()) {
                    if (this.orderPrice.has(order.price)) {
                        this.orderPrice.set(order.price, this.orderPrice.get(order.price) + (order.size - order.filled_size))
                    } else {
                        this.orderPrice.set(order.price, (order.size - order.filled_size))
                    }
                }
                //将订单的数据合并到深度信息中
                let tem_a = this.asks.slice();
                let tem_b = this.bids.slice();
                tem_a.forEach((element, index, array) => {
                    if (this.orderPrice.has(element[0])) {
                        if (array[index] < 4) {
                            array[index].push(this.orderPrice.get(element[0]))
                        } else {
                            array[index][3] = this.orderPrice.get(element[0]);
                        }
                    }
                })
                tem_b.forEach((element, index, array) => {
                    if (this.orderPrice.has(element[0])) {
                        if (array[index] < 4) {
                            array[index].push(this.orderPrice.get(element[0]))
                        } else {
                            array[index][3] = this.orderPrice.get(element[0]);
                        }

                    }
                })
                //console.log("now:", Date.now(), sendDepthTime, Date.now() - sendDepthTime)
                sendDepthTime = Date.now();
                this.event.emit("depth", {
                    "asks": tem_a,
                    "bids": tem_b
                });
                //  console.log("asks:", JSON.stringify(tem_a.slice(0, 5)))
                // console.log("bids:", JSON.stringify(tem_b.slice(0, 5)))
            }

        }))
    }

    //websocket 返回消息
    // wsMessage(data) {

    //     var obj = JSON.parse(data);
    //     var eventType = obj.event;
    //     if (eventType == 'login') {
    //         //登录消息
    //         if (obj.success == true) {
    //             this.event.emit('login');
    //         }
    //     } else if (eventType == undefined) {
    //         //行情消息相关
    //         this.event.emit(obj.table, obj);
    //         // tableMsg(obj);
    //     }
    // }
    sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms)
        })
    }
    orderMonitor() {//订单api限制 每2秒20次
        //将所有的订单都获取缓存,循环执行订单的自动撤消 
        //1.订单的tradeid 标记规则:要能分辨订单类型,订单时间,订单发起者
        //2.如果是刷量的订单
        //3.如果是刷量的订单时间大于多少就需要自动撤消
        //4.如果是批量交易的单子需要如何清理?
    }
}



//acctInfo({ instrument_id: config.instrument_id, httpkey: config.httpkey, httpsecret: config.httpsecret, passphrase: config.passphrase })
// setTimeout(() => {
//     stopWebsocket()
// }, 30 * 1000);
// setTimeout(() => {
//     startWebsocket()
// }, 60 * 1000);
export default {
    acctInfo,
    stopWebsocket
}
