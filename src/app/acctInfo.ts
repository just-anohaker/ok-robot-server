var EventEmitter = require('events').EventEmitter;
const { PublicClient } = require('@okfe/okex-node');
const { V3WebsocketClient } = require('@okfe/okex-node');
const { AuthenticatedClient } = require('@okfe/okex-node');
var config  = require('./config');
var self

function acctInfo(httpkey, httpsecret, passphrase){
    this.httpkey = httpkey;
    this.httpsecret = httpsecret;
    this.passphrase = passphrase;
    this.tickerData;
    this.bids;
    this.asks;
    this.isClosed;
    self = this;

    this.wss =  new V3WebsocketClient(config.websocekHost);
    this.pClient=  new PublicClient(config.urlHost);
    this.authClient = new AuthenticatedClient(httpkey, 
        httpsecret, passphrase);
    this.event = new EventEmitter();
    startWebsocket();
}

function startWebsocket(){
    //websocket 初始化
    console.log('spot.......');
    self.wss.connect();
    self.wss.on('open', data=>{
        console.log("websocket open!!!");
        self.wss.login(self.httpkey, self.httpsecret, self.passphrase);
    });
    self.wss.on('message', wsMessage);
    self.wss.on('close', ()=>{
        self.isClosed = true
    });
    self.event.on('login',data =>{
        (async function(){
            self.wss.subscribe(config.channel_order+':'+config.instrument_id); 
            self.wss.subscribe(config.channel_ticker+':'+config.instrument_id); 
        }())
    })
    // self.event.on(config.channel_ticker,(info => {
    //     var d = info.data[0];
    //     if(self.tickerData){
    //         console.log(d.instrument_id+`---------------买一 `+d.best_bid + ' 卖一 ' +d.best_ask + ' 最新成交价:'+d.last  );  
    //     }
    //     self.tickerData = d;
    // }))
    
}

//websocket 返回消息
function wsMessage(data){
    
    var obj = JSON.parse(data);
    var eventType = obj.event;

    if(eventType == 'login'){
        //登录消息
        if(obj.success == true){
            self.event.emit('login');
        }
    }else if(eventType == undefined){
        //行情消息相关
        self.event.emit(obj.table,obj);
       // tableMsg(obj);
    }
}

function orderMonitor(){//订单api限制 每2秒20次
    //将所有的订单都获取缓存,循环执行订单的自动撤消 
    //1.订单的tradeid 标记规则:要能分辨订单类型,订单时间,订单发起者
    //2.如果是刷量的订单
    //3.如果是刷量的订单时间大于多少就需要自动撤消
    //4.如果是批量交易的单子需要如何清理?
}
var ac = new acctInfo(config.httpkey, config.httpsecret, config.passphrase);
ac.event.on(config.channel_ticker,(info => {
    var d = info.data[0];
    console.log(d.instrument_id+`买一 `+d.best_bid + ' 卖一 ' +d.best_ask + ' 最新成交价:'+d.last  );
}))

export default acctInfo