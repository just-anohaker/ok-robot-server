import { EventEmitter } from "events";
const { V3WebsocketClient } = require('@okfe/okex-node');
const { PublicClient } = require('@okfe/okex-node');
var config = require('./config');
let publics = new Map();
var CRC32 = require('crc-32');   
let channel;
async function initPublicInfo(pamams): Promise<PublicInfo> {
    if (publics.has(pamams.instrument_id)) {
        let a = publics.get(pamams.instrument_id)
        a.startWebsocket();
        return a;
    }
    var ac = new PublicInfo(pamams.instrument_id);
    publics.set(pamams.instrument_id, ac);
    await ac.initData();
    ac.startWebsocket();
    return ac
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
        publics.delete(channel.instrument_id)
    }
}
export class PublicInfo {
    public event: EventEmitter;
    private instrument_id: any;
    public tickerData: any;
    public instrumentInfo: any;
    public wss: any;
    public bids: any;
    public asks: any;
    private isClosed: any
    private pClient: any
    private interval_reconnet: any
    constructor(instrument_id) {
        this.instrument_id = instrument_id
        this.tickerData;
        this.isClosed;
        this.event = new EventEmitter();
        this.wss = new V3WebsocketClient(config.websocekHost);
        this.pClient = new PublicClient(config.urlHost);
    }
    async initData() {
        this.interval_reconnet = setInterval(() => {
            this.startWebsocket();
        }, 1000 * 6)
        this.wss.on('open', data => {
            console.log("websocket open!!!");
            this.isClosed = false
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
            } else if (eventType == undefined) {
                //行情消息相关
                this.event.emit(obj.table, obj);
                // tableMsg(obj);
            }
        });
        this.wss.on('close', () => {
            this.isClosed = true
            this.tickerData = undefined
        });
        this.event.on(config.channel_ticker, (info => {
            var d = info.data[0];
            this.tickerData = d
        }))
        let in_flag = false;
        this.event.on(config.channel_depth, (info => {
            var d = info.data[0];
            if (!this.asks) {
                this.asks = d.asks;
                this.bids = d.bids;
            } else {
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

                if (this.checksum(this.asks, this.bids) != d.checksum && !in_flag) {//this.checksum(this.asks, this.bids) != d.checksum
                    console.log("checksum error unsubscribe channel_depth ", this.instrument_id, Date.now())
                    const resubscribe = async () => {
                        // await this.sleep(30*1000)
                        in_flag = true;
                        this.wss.unsubscribe(config.channel_depth + ':' + this.instrument_id);
                        await this.sleep(5 * 1000)
                        console.log("checksum  resubscribe channel_depth ", this.instrument_id, Date.now())
                        this.wss.subscribe(config.channel_depth + ':' + this.instrument_id);
                        this.asks = undefined;
                        this.bids = undefined;
                        //await this.sleep(30*1000)
                        in_flag = false;
                    };
                    resubscribe();
                }
            }

        }))
        let ins = await this.pClient.spot().getSpotInstruments();
        ins.forEach(element => {
            if (element.instrument_id != undefined && element.instrument_id.toLowerCase()
                == this.instrument_id.toLowerCase()) {
                this.instrumentInfo = element
            }
        });
        // this.wss.login(this.httpkey, this.httpsecret, this.passphrase);
    }
    stopWebsocket() {
        this.wss.close();
        this.asks = undefined;
        this.bids = undefined;
        clearInterval(this.interval_reconnet)
    }
    checksum(asks,bids){
        let tempa= asks.slice(0,25);
        let tempb= bids.slice(0,25);
        let arr = tempb.map((x,index )=> tempb[index][0]+":"+tempb[index][1] +":"+tempa[index][0]+":"+tempa[index][1]);
       return CRC32.str( arr.join(":"))    
    }
    startWebsocket() {
        if (this.isClosed == false) {
            return
        }
        console.log("startWebsocket!!")
        this.wss.connect();
    }

    sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms)
        })
    }
    isStoped() {
        return this.isClosed;
    }

}


export default {
    initPublicInfo
}
