import Proxy from "../../../patterns/proxy/Proxy";
import { OKExAutoTradeOptions, IOKexAccount } from "../../Types";
declare class VolumeMakerProxy extends Proxy {
    static readonly NAME: string;
    constructor();
    onRegister(): void;
    setAutoTradeOptions(tradeOptions: OKExAutoTradeOptions, account: IOKexAccount): void;
    startAutoTrade(): void;
    stopAutoTrade(): void;
    private onDeepEvent;
    private onTickerEvent;
    private onOrderEvent;
}
export default VolumeMakerProxy;
