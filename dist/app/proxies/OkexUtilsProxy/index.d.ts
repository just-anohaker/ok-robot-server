import Proxy from "../../../patterns/proxy/Proxy";
import { OkexTradeParameters, OkexCandlesParameters, OkexTickerParameters } from "../../Types";
declare class OkexUtilsProxy extends Proxy {
    static NAME: string;
    private publicClient;
    constructor();
    onRegister(): void;
    getSpotTicker(args: OkexTickerParameters): Promise<any>;
    getSpotTrade(args: OkexTradeParameters): Promise<any>;
    getSpotCandles(args: OkexCandlesParameters): Promise<any>;
}
export default OkexUtilsProxy;
