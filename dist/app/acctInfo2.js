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
const events_1 = require("events");
const { PublicClient } = require('@okfe/okex-node');
const { V3WebsocketClient } = require('@okfe/okex-node');
const { AuthenticatedClient } = require('@okfe/okex-node');
var config = require('./config');
const sqlite3_1 = __importDefault(require("./../sqlite3"));
const DbOrders_1 = require("./DbOrders");
const __1 = require("./..");
var CRC32 = require('crc-32');
let accouts = new Map();
function acctInfo(pamams) {
    if (accouts.has(pamams.instrument_id + pamams.httpkey)) {
        let a = accouts.get(pamams.instrument_id + pamams.httpkey);
        if (a.isClosed) {
            a.startWebsocket();
        }
        return a;
    }
    var ac = new AccountInfo(pamams.instrument_id, pamams.httpkey, pamams.httpsecret, pamams.passphrase);
    accouts.set(pamams.instrument_id + pamams.httpkey, ac);
    ac.initData();
    ac.startWebsocket();
    return ac;
}
function stopWebsocket(pamams) {
    if (accouts.has(pamams.instrument_id + pamams.httpkey)) {
        accouts.get(pamams.instrument_id + pamams.httpkey).stopWebsocket();
        accouts.delete(pamams.instrument_id + pamams.httpkey);
    }
}
class AccountInfo {
    constructor(instrument_id, httpkey, httpsecret, passphrase) {
        this.httpkey = httpkey;
        this.httpsecret = httpsecret;
        this.passphrase = passphrase;
        this.instrument_id = instrument_id;
        this.tickerData;
        this.bids;
        this.asks;
        this.isClosed;
        this.pendingOrders = new Map();
        this.orderPrice = new Map();
        this.event = new events_1.EventEmitter();
        this.order_db = new DbOrders_1.DbOrders(sqlite3_1.default.getInstance().Sqlite3Handler, {
            instrument_id, httpkey, httpsecret, passphrase
        });
        this.wss = new V3WebsocketClient(config.websocekHost);
        this.pClient = new PublicClient(config.urlHost);
        this.authClient = new AuthenticatedClient(httpkey, httpsecret, passphrase);
    }
    initOrderData() {
        return __awaiter(this, void 0, void 0, function* () {
            let start = true;
            let limit = 100;
            let from;
            // 初始化 订单
            while (start) {
                let res;
                try {
                    if (from) {
                        res = yield this.authClient.spot().getOrdersPending({ 'instrument_id': this.instrument_id, 'limit': limit, 'from': from });
                    }
                    else {
                        res = yield this.authClient.spot().getOrdersPending({ 'instrument_id': this.instrument_id, 'limit': limit });
                    }
                    res.forEach((ele) => {
                        console.log("未完成订单:" + ele.price + "---" + ele.size);
                        this.pendingOrders.set(ele.order_id, ele);
                        // if(!this.pendingOrders.has(ele.order_id )){
                        //     this.pendingOrders.set(ele);
                        // }
                    });
                    if (res.length > 0) {
                        from = res[res.length - 1].order_id;
                    }
                    yield this.sleep(100); //每秒10次 限制是每2秒20次
                    if (res.length < limit) {
                        start = false;
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
            this.wss.login(this.httpkey, this.httpsecret, this.passphrase);
        });
    }
    stopWebsocket() {
        this.wss.close();
        this.tickerData = undefined;
    }
    initData() {
        let sendDepthTime = undefined;
        this.interval_reconnet = setInterval(() => {
            this.startWebsocket();
        }, 1000 * 6);
        this.wss.on('open', data => {
            console.log("websocket open!!!");
            this.isClosed = false;
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
            }
            else if (eventType == undefined) {
                //行情消息相关
                this.event.emit(obj.table, obj);
                // tableMsg(obj);
            }
        });
        this.wss.on('close', () => {
            this.isClosed = true;
            this.tickerData = undefined;
        });
        this.event.on('login', data => {
            console.log("websocket login!!!");
            //this.isClosed = false
            this.wss.subscribe(config.channel_order + ':' + this.instrument_id);
            this.wss.subscribe(config.channel_ticker + ':' + this.instrument_id);
            this.wss.subscribe(config.channel_depth + ':' + this.instrument_id);
        });
        this.event.on(config.channel_ticker, (info => {
            var d = info.data[0];
            this.tickerData = d;
            //console.log("tickerData---"+d.instrument_id + `买一 ` + d.best_bid + ' 卖一 ' + d.best_ask );  
            this.event.emit("ticker", d);
        }));
        this.event.on(config.channel_order, (info => {
            var d = info.data[0];
            // if(d.state == -1 ){
            //     console.log("订单监听:撤单成功---"+JSON.stringify(d.order_id) );  
            // }else if(d.state == 0 ){
            //     console.log("订单监听:等待成交---"+JSON.stringify(d.order_id) );  
            // }
            if (d.state == -1 || d.state == 2) { //撤单成功或者完全成交
                if (this.pendingOrders.has(d.order_id)) {
                    this.pendingOrders.delete(d.order_id);
                }
                if (d.state == -1 && d.client_oid.substring(0, 1) == config.orderType.autoMaker) {
                    console.log("订单监听 state= -1:" + JSON.stringify(d));
                    // d.created_at  ="",  d.funds="", d.price_avg="",  d.product_id="",d.acct_key = this.httpkey;
                    if (this.order_db.getOrderByOrderId(d.order_id).length < 1) {
                        this.order_db.addInMonitor(d);
                    }
                    else {
                        this.order_db.updateAllInfo(d);
                    }
                }
            }
            else if (d.state == 0 || d.state == 1) { //部分成交或者等待成交的单子
                this.pendingOrders.set(d.order_id, d);
            }
            //console.log(d.instrument_id+`买一 `+d.best_bid + ' 卖一 ' +d.best_ask + ' 最新成交价:'+d.last  );  
            //orderPrice.set()
        }));
        let in_flag = false;
        this.event.on(config.channel_depth, (info => {
            var d = info.data[0];
            if (!this.asks) {
                this.asks = d.asks;
                this.bids = d.bids;
            }
            else { //TODO 监听到盘口买一价格 不是自己的订单 并且有空间就挂个小量订单 需要考虑是否影响其他自动交易
                d.asks.forEach((new_d) => {
                    let index = this.asks.findIndex(function (local_d) {
                        return new_d[0] <= local_d[0]; //价格相同,数量不同则更新
                    });
                    if (index >= 0) { //如果找到就更新
                        if (new_d[0] == this.asks[index][0]) {
                            if (new_d[1] == 0) { //数量为0就删除
                                this.asks.splice(index, 1);
                            }
                            else {
                                this.asks[index] = new_d; //替换
                            }
                        }
                        else { //没有找到相同价格就插入
                            this.asks.splice(index, 0, new_d);
                        }
                    }
                    else { //卖价最高
                        this.asks.push(new_d);
                    }
                });
                d.bids.forEach((new_d) => {
                    let index = this.bids.findIndex(function (local_d) {
                        return new_d[0] >= local_d[0]; //价格相同,数量不同则更新
                    });
                    if (index >= 0) { //如果找到就更新
                        if (new_d[0] == this.bids[index][0]) {
                            if (new_d[1] == 0) { //数量为0就删除
                                this.bids.splice(index, 1);
                            }
                            else {
                                this.bids[index] = new_d; //替换
                            }
                        }
                        else { //没有找到相同价格就插入
                            this.bids.splice(index, 0, new_d);
                        }
                    }
                    else { //出价最低
                        this.bids.push(new_d);
                    }
                });
            }
            if (this.checksum(this.asks, this.bids) != d.checksum && !in_flag) { //this.checksum(this.asks, this.bids) != d.checksum
                console.log("checksum error unsubscribe channel_depth ", this.instrument_id, Date.now());
                const resubscribe = () => __awaiter(this, void 0, void 0, function* () {
                    // await this.sleep(30*1000)
                    in_flag = true;
                    this.wss.unsubscribe(config.channel_depth + ':' + this.instrument_id);
                    yield this.sleep(5 * 1000);
                    console.log("checksum  resubscribe channel_depth ", this.instrument_id, Date.now());
                    this.wss.subscribe(config.channel_depth + ':' + this.instrument_id);
                    this.asks = undefined;
                    this.bids = undefined;
                    //await this.sleep(30*1000)
                    in_flag = false;
                });
                resubscribe();
            }
            if (sendDepthTime == undefined || Date.now() - sendDepthTime > config.SendDepTime) {
                this.orderPrice.clear();
                //合并订单价格
                for (var order of this.pendingOrders.values()) {
                    if (this.orderPrice.has(order.price)) {
                        this.orderPrice.set(order.price, Number(Number(this.orderPrice.get(order.price) + (order.size - order.filled_size)).toFixed(4)));
                    }
                    else {
                        this.orderPrice.set(order.price, Number(Number(order.size - order.filled_size).toFixed(4)));
                    }
                }
                //将订单的数据合并到深度信息中
                let tem_a = this.asks.slice();
                let tem_b = this.bids.slice();
                tem_a.forEach((element, index, array) => {
                    if (this.orderPrice.has(element[0])) {
                        if (array[index].length > 3) {
                            console.log("before error1111", array[index]);
                        }
                        let tempv = Object.assign([], array[index]);
                        tempv[3] = this.orderPrice.get(element[0]);
                        array[index] = tempv;
                        array[index][3] = this.orderPrice.get(element[0]);
                    }
                });
                tem_b.forEach((element, index, array) => {
                    if (this.orderPrice.has(element[0])) {
                        if (array[index].length > 3) {
                            console.log("before error2222", array[index]);
                        }
                        let tempv = Object.assign([], array[index]);
                        tempv[3] = this.orderPrice.get(element[0]);
                        array[index] = tempv;
                    }
                });
                //console.log("now:", Date.now(), sendDepthTime, Date.now() - sendDepthTime)
                sendDepthTime = Date.now();
                __1.Facade.getInstance().sendNotification("depth" + ":" + this.instrument_id, {
                    "asks": tem_a,
                    "bids": tem_b
                });
                //console.log("asks:", JSON.stringify(tem_a.slice(0, 5)))
                //  console.log("bids:", JSON.stringify(tem_b.slice(0, 5)))
            }
        }));
    }
    startWebsocket() {
        // console.log('spot.......');
        if (this.isClosed == false) {
            return;
        }
        this.wss.connect();
    }
    checksum(asks, bids) {
        let tempa = asks.slice(0, 25);
        let tempb = bids.slice(0, 25);
        let arr = tempb.map((x, index) => tempb[index][0] + ":" + tempb[index][1] + ":" + tempa[index][0] + ":" + tempa[index][1]);
        return CRC32.str(arr.join(":"));
    }
    sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }
    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值 
    }
    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min; //这个值不小于 min（有可能等于），并且小于（不等于）max。
    }
    orderMonitor() {
        //将所有的订单都获取缓存,循环执行订单的自动撤消 
        //1.订单的tradeid 标记规则:要能分辨订单类型,订单时间,订单发起者
        //2.如果是刷量的订单
        //3.如果是刷量的订单时间大于多少就需要自动撤消
        //4.如果是批量交易的单子需要如何清理?
    }
    /**
     *   //每次挂单数量
     * perStartSize
     * perTopSize
        params.countPerM  //每分钟成交多少笔
        params.instrument_id
     */
    startAutoMaker(params) {
        // if (this.isClosed == true) {
        //     return {
        //         result: false,
        //         error_message: "socket not ready!"
        //     }
        // }
        if (params.countPerM > 200) {
            return {
                result: false,
                error_message: "too many per min!"
            };
        }
        if (this.isAutoMaker()) {
            return {
                result: false,
                error_message: "is auto makering!"
            };
        }
        let order_interval = 60 * 1000 / params.countPerM;
        let orderMap = new Map();
        console.log("order_interval", order_interval);
        this.interval_autoMaker = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            let t = new Date(this.tickerData.timestamp).getTime();
            // console.log( Math.abs(Date.now() - t) )
            if (this.tickerData && Math.abs(Date.now() - t) > 5 * 60 * 1000) {
                console.log("无法刷量下单! ticker data time exceed", Math.abs(Date.now() - t) / 1000, "s");
                return;
            }
            if (this.tickerData && Number(this.tickerData.best_ask) - Number(this.tickerData.best_bid) > 0.00019) { //TODO 确认tickerdata 短期内有更新  TODO 精度确认
                // var instrument_id = tickerData.instrument_id
                // var bid = tickerData.best_bid//买一 tickerData.best_ask//卖一
                console.log("interval ---" + this.tickerData.instrument_id + `买一 ` + this.tickerData.best_bid + ' 卖一 ' + this.tickerData.best_ask);
                let randomPrice = this.getRandomArbitrary(parseFloat(this.tickerData.best_bid) + 0.0001, parseFloat(this.tickerData.best_ask));
                let perSize = this.getRandomArbitrary(parseFloat(params.perStartSize), parseFloat(params.perTopSize));
                console.log("random randomPrice ---", randomPrice);
                let side1;
                let side2;
                if (params.type == 1) {
                    side1 = 'buy';
                    side2 = 'sell';
                }
                else if (params.type == 2) {
                    side1 = 'sell';
                    side2 = 'buy';
                }
                else if (params.type == 3) {
                    let randomint = this.getRandomIntInclusive(0, 1);
                    console.log("randomint ---", JSON.stringify(randomint));
                    if (randomint == 0) {
                        side1 = 'buy';
                        side2 = 'sell';
                    }
                    else {
                        side1 = 'sell';
                        side2 = 'buy';
                    }
                }
                let toOrder = {
                    'type': 'limit', 'side': side1,
                    'instrument_id': this.instrument_id, 'size': perSize, 'client_oid': config.orderType.autoMaker + Date.now() + 'M',
                    'price': randomPrice, 'margin_trading': 1, 'order_type': '0'
                };
                let toTaker = {
                    'type': 'limit', 'side': side2,
                    'instrument_id': this.instrument_id, 'size': perSize, 'client_oid': config.orderType.autoMaker + Date.now() + 'T',
                    'price': randomPrice, 'margin_trading': 1, 'order_type': '3' //立即成交并取消剩余（IOC）
                };
                let order_array = new Array();
                order_array.push(toOrder);
                order_array.push(toTaker);
                let batch_o = yield this.authClient.spot().postBatchOrders(order_array);
                // console.log("下单 ---", JSON.stringify(order_array))
                let order_ids = [];
                batch_o[this.instrument_id.toLowerCase()].forEach(function (ele) {
                    //  console.log("interval_autoMaker" + ele.result + "---" + ele.order_id)
                    if (ele.result) {
                        order_ids.push(ele.order_id);
                    }
                });
                // console.log("撤单 ---", JSON.stringify(order_ids))
                let result = yield this.authClient.spot().postCancelBatchOrders([{ 'instrument_id': this.instrument_id, 'order_ids': order_ids }]);
                // console.log("撤单 ---后o2", JSON.stringify(result))
            }
            else {
                this.tickerData == undefined ? console.log("无法获取当前盘口价格!")
                    : console.log("无法刷量下单!", this.tickerData.best_bid, this.tickerData.best_ask);
            }
        }), order_interval);
    }
    stopAutoMaker() {
        clearInterval(this.interval_autoMaker);
        clearInterval(this.interval_reconnet);
        this.asks = undefined;
        this.bids = undefined;
        this.interval_autoMaker = undefined;
    }
    isAutoMaker() {
        return this.interval_autoMaker != undefined;
    }
}
exports.AccountInfo = AccountInfo;
//acctInfo({ instrument_id: config.instrument_id, httpkey: config.httpkey, httpsecret: config.httpsecret, passphrase: config.passphrase })
// setTimeout(() => {
//     stopWebsocket()
// }, 30 * 1000);
// setTimeout(() => {
//     startWebsocket()
// }, 60 * 1000);
exports.default = {
    acctInfo,
    stopWebsocket
};
