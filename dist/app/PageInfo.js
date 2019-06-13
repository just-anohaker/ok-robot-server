"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const { V3WebsocketClient } = require('@okfe/okex-node');
const __1 = require("./..");
var config = require('./config');
let page = new Map();
let channel;
function initPageInfo(pamams) {
    if (page.has(pamams.instrument_id)) {
        let a = page.get(pamams.instrument_id);
        return a;
    }
    var ac = new PageInfo(pamams.instrument_id);
    page.set(pamams.instrument_id, ac);
    ac.initData();
    ac.startWebsocket();
    return ac;
}
/***
 * {
 * params:
 * instrument_id
 * channel
 * }
 */
function subscribeKline(params) {
    if (page.has(params.instrument_id)) {
        let p = page.get(params.instrument_id);
        try {
            p.subscribeKline(params);
        }
        catch (error) {
            return {
                result: false,
                error_message: error + ''
            };
        }
        return {
            result: true,
        };
    }
    return {
        result: false,
        error_message: 'init PageInfo first!'
    };
}
/***
 * {
 * params:
 * instrument_id
 * channel
 * }
 */
function stopWebsocket(channel) {
    if (page.has(channel.instrument_id)) {
        page.get(channel.instrument_id).stopWebsocket();
        page.delete(channel.instrument_id);
    }
}
class PageInfo {
    constructor(instrument_id) {
        this.instrument_id = instrument_id;
        this.tickerData;
        this.event = new events_1.EventEmitter();
        this.wss = new V3WebsocketClient(config.websocekHost);
    }
    initData() {
        this.wss.on('open', data => {
            console.log("websocket open!!!");
            this.wss.subscribe(config.channel_trade + ':' + this.instrument_id);
            this.wss.subscribe(config.channel_ticker + ':' + this.instrument_id);
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
            //this.event.emit("page/ticker" + ':' + this.instrument_id, d);
            // console.log(JSON.stringify(d))
            __1.Facade.getInstance().sendNotification("page/ticker" + ':' + this.instrument_id, d);
        }));
        this.event.on(config.channel_trade, (info => {
            var d = info.data[0];
            //console.log(JSON.stringify(d))
            //this.event.emit("page/trade" + ':' + this.instrument_id, d);
            __1.Facade.getInstance().sendNotification("page/trade" + ':' + this.instrument_id, d);
        }));
        // this.wss.login(this.httpkey, this.httpsecret, this.passphrase);
    }
    subscribeKline(params) {
        if (this.klineCannel != undefined) {
            this.wss.unsubscribe(this.klineCannel + ':' + params.instrument_id);
        }
        this.wss.subscribe(params.channel + ':' + params.instrument_id);
        this.klineCannel = params.channel + ':' + params.instrument_id;
        if (this.event.listenerCount(this.klineCannel) <= 0) {
            this.event.on(params.channel, (info => {
                //var d = info.data[0];
                // this.event.emit("page/candle" + ':' + this.instrument_id, info);
                console.log(JSON.stringify(info));
                __1.Facade.getInstance().sendNotification("page/candle" + ':' + this.instrument_id, info);
            }));
        }
    }
    unsubscribeKline(params) {
        this.wss.unsubscribe(params.channel + ':' + params.instrument_id);
    }
    stopWebsocket() {
        this.wss.close();
    }
    startWebsocket() {
        console.log('spot.......');
        // if (this.isClosed == false) {
        //     return
        // }
        let sendDepthTime = undefined;
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
exports.PageInfo = PageInfo;
exports.default = {
    initPageInfo,
    subscribeKline
};
