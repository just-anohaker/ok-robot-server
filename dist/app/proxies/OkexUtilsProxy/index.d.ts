import Proxy from "../../../patterns/proxy/Proxy";
import { OkexTradeParameters, OkexCandlesParameters, OkexTickerParameters, OKexAccount, OkexWalletInfo, OkexCurrencyInfo } from "../../Types";
declare class OkexUtilsProxy extends Proxy {
    static NAME: string;
    private publicClient;
    constructor();
    onRegister(): void;
    getSpotTicker(args: OkexTickerParameters): Promise<any>;
    getSpotTrade(args: OkexTradeParameters): Promise<any>;
    getSpotCandles(args: OkexCandlesParameters): Promise<any>;
    getWallet(account: OKexAccount, currencies: string[]): Promise<OkexWalletInfo[]>;
    getWalletList(account: OKexAccount): Promise<OkexCurrencyInfo[]>;
}
export default OkexUtilsProxy;
