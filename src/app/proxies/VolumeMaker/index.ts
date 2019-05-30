import Proxy from "../../../patterns/proxy/Proxy";
import { OKExAutoTradeOptions, IOKexAccount } from "../../Types";
import {
    NotificationDeep,
    NotificationTicker,
    NotificationOrder
} from "../../Types";
import { Facade } from "../../..";
const {setAutoTrade: nodeSetAutoTrade,
    startAutoTrade: nodeStartAutoTrade,
    stopAutoTrade: nodeStopAutoTrade,
    innerEvent
} = require("./internal/volumeMaker");

class VolumeMakerProxy extends Proxy {
    static readonly NAME: string = "PROXY_VOLUME_MAKER";

    constructor() {
        super(VolumeMakerProxy.NAME);

    }

    onRegister() {
        innerEvent.on(NotificationDeep, this.onDeepEvent.bind(this));
        innerEvent.on(NotificationTicker, this.onTickerEvent.bind(this));
        innerEvent.on(NotificationOrder, this.onOrderEvent.bind(this));
    }

    setAutoTradeOptions(tradeOptions: OKExAutoTradeOptions, account: IOKexAccount) {
        nodeSetAutoTrade(tradeOptions, account);
    }

    startAutoTrade() {
        nodeStartAutoTrade();
    }

    stopAutoTrade() {
        nodeStopAutoTrade();
    }

    private onDeepEvent(info:any): void {
        Facade.getInstance().sendNotification(NotificationDeep, info);
    }

    private onTickerEvent(info: any): void {
        Facade.getInstance().sendNotification(NotificationTicker, info);
    }

    private onOrderEvent(info: any): void {
        Facade.getInstance().sendNotification(NotificationOrder, info);
    }
}
export default VolumeMakerProxy;