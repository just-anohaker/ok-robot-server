var EventEmitter = require('events').EventEmitter;
import { PublicClient } from '@okfe/okex-node';
import { V3WebsocketClient } from '@okfe/okex-node';
import { AuthenticatedClient } from '@okfe/okex-node';
var config  = require('./config');
var self

let _instance = undefined;
export default function publicInfo(){
    if (_instance === undefined) {
        _instance = {};
        _instance.wss =  new V3WebsocketClient(config.websocekHost);
        _instance.pClient=  PublicClient(config.urlHost);
        _instance.tickerData;
        _instance.bids;
        _instance.asks;
        _instance.event = new EventEmitter();
        _instance.isClosed
        self = _instance
        startWebsocket();
    }

    return _instance;
}


/**********  公共信息 start  ***********************/
function startWebsocket(){
    //websocket 初始化
    console.log('spot.......');
    self.wss.connect();
   
    self.wss.on('open', data=>{
        console.log("websocket open!!!");
        self.isClosed = false
        self.wss.subscribe(config.channel_ticker+':'+config.instrument_id);
        self.wss.subscribe(config.channel_depth+':'+config.instrument_id); 
    });
    self.wss.on('message', wsMessage);
    self.wss.on('close', ()=>{
        self.isClosed = true
    });

    self.event.on(config.channel_ticker,(info => {
        var d = info.data[0];
        if(self.tickerData){
            console.log(d.instrument_id+`---------------买一 `+d.best_bid + ' 卖一 ' +d.best_ask + ' 最新成交价:'+d.last  );  
        }
        self.tickerData = d;
    }))

    self.event.on(config.channel_depth,(info => {
        var d = info.data[0];
        if(!self.asks){
            self.asks = d.asks;
            self.bids = d.bids;
        }else{//TODO 监听到盘口买一价格 不是自己的订单 并且有空间就挂个小量订单 需要考虑是否影响其他自动交易
            d.asks.forEach((new_d)=>{//卖方从小到大排列
               let index= self.asks.findIndex(function(local_d) {
                return new_d[0] <= local_d[0] ;//价格相同,数量不同则更新
              })
              if(index>=0){//如果找到就更新
               if( new_d[0] == self.asks[index][0]){
                    if(new_d[1] == 0){//数量为0就删除
                        self.asks.splice(index,1)
                    }else{
                        self.asks[index] = new_d;//替换
                    }
               }else{//没有找到相同价格就插入
                self.asks.splice(index,0,new_d)
               } 
                
              }else{//卖价最高
                self.asks.push(new_d)
              }
            })

            d.bids.forEach((new_d)=>{//买方从大到小排列
                let index= self.bids.findIndex(function(local_d) {
                 return new_d[0] >= local_d[0] ;//价格相同,数量不同则更新
               })
               if(index == 0){
                   //有人下单 如果价格不是我们自己买单的价格,就别人下单
               }
               if(index>=0){//如果找到就更新
                if( new_d[0] == self.bids[index][0]){
                     if(new_d[1] == 0){//数量为0就删除
                        self.bids.splice(index,1)
                     }else{
                        self.bids[index] = new_d;//替换
                     }
                }else{//没有找到相同价格就插入
                    self.bids.splice(index,0,new_d)
                } 
                 
               }else{//出价最低
                self.bids.push(new_d)
               }
             })
        }

    }))
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
/**********  公共信息 end  ***********************/

// var pci = new publicInfo();

// setInterval(() => {
//     console.log("asks :"+JSON.stringify(pci.asks.slice(0,5))); 
//     console.log("bids :"+JSON.stringify(pci.bids.slice(0,5))); 
// }, 5*1000);