"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const { V3WebsocketClient } = require('@okfe/okex-node');
const { PublicClient } = require('@okfe/okex-node');
var config = require('./config');
let publics = new Map();
let channel;
function initPublicInfo(pamams) {
    return __awaiter(this, void 0, void 0, function* () {
        if (publics.has(pamams.instrument_id)) {
            let a = publics.get(pamams.instrument_id);
            a.startWebsocket();
            return a;
        }
        var ac = new PublicInfo(pamams.instrument_id);
        publics.set(pamams.instrument_id, ac);
        yield ac.initData();
        ac.startWebsocket();
        return ac;
    });
}
/***
 * {
 * params:
 * instrument_id
 * channel
 * }
 */
function stopWebsocket(channel) {
    if (publics.has(channel.instrument_id)) {
        publics.get(channel.instrument_id).stopWebsocket();
        publics.delete(channel.instrument_id);
    }
}
class PublicInfo {
    constructor(instrument_id) {
        this.instrument_id = instrument_id;
        this.tickerData;
        this.isClosed;
        this.event = new events_1.EventEmitter();
        this.wss = new V3WebsocketClient(config.websocekHost);
        this.pClient = new PublicClient(config.urlHost);
    }
    initData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.interval_reconnet = setInterval(() => {
                this.startWebsocket();
            }, 1000 * 6);
            this.wss.on('open', data => {
                console.log("websocket open!!!");
                this.isClosed = false;
                this.wss.subscribe(config.channel_ticker + ':' + this.instrument_id);
                this.wss.subscribe(config.channel_depth + ':' + this.instrument_id);
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
            this.event.on(config.channel_ticker, (info => {
                var d = info.data[0];
                this.tickerData = d;
            }));
            this.event.on(config.channel_depth, (info => {
                var d = info.data[0];
                if (!this.asks) {
                    this.asks = d.asks;
                    this.bids = d.bids;
                }
                else {
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
            }));
            let ins = yield this.pClient.spot().getSpotInstruments();
            ins.forEach(element => {
                if (element.instrument_id != undefined && element.instrument_id.toLowerCase()
                    == this.instrument_id.toLowerCase()) {
                    this.instrumentInfo = element;
                }
            });
            // this.wss.login(this.httpkey, this.httpsecret, this.passphrase);
        });
    }
    stopWebsocket() {
        this.wss.close();
        clearInterval(this.interval_reconnet);
    }
    startWebsocket() {
        if (this.isClosed == false) {
            return;
        }
        console.log("startWebsocket!!");
        this.wss.connect();
    }
    sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }
    isStoped() {
        return this.isClosed;
    }
}
exports.PublicInfo = PublicInfo;
exports.default = {
    initPublicInfo
};
