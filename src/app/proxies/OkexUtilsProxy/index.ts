import Proxy from "../../../patterns/proxy/Proxy";
import {
    OkexTradeParameters,
    OkexCandlesParameters,
    OkexTickerParameters,
    OKexAccount,
    OkexWalletInfo,
    OkexCurrencyInfo
} from "../../Types";

import { PublicClient, AuthenticatedClient } from "@okfe/okex-node"

class OkexUtilsProxy extends Proxy {
    static NAME: string = "PROXY_OKEX_UTILS";

    private publicClient = PublicClient();

    constructor() {
        super(OkexUtilsProxy.NAME);
    }

    onRegister() {
        // TODO
    }

    async getSpotTicker(args: OkexTickerParameters): Promise<any> {
        return await this.publicClient.spot().getSpotTicker(args.instrument_id);
    }

    async getSpotTrade(args: OkexTradeParameters): Promise<any> {
        return await this.publicClient.spot().getSpotTrade(args.instrument_id, args.params);
    }

    async getSpotCandles(args: OkexCandlesParameters): Promise<any> {
        return await this.publicClient.spot().getSpotCandles(args.instrument_id, args.params);
    }

    async getWallet(account: OKexAccount, currencies: string[]): Promise<OkexWalletInfo[]> {
        const authClient = AuthenticatedClient(account.httpkey, account.httpsecret, account.passphrase);
        const resp = await authClient.spot().getAccounts();
        console.log("[OkexUtilsProxy] getWallet:", resp);
        return resp.filter(wallet => currencies.includes(wallet.currency));
    }

    async getWalletList(account: OKexAccount): Promise<OkexCurrencyInfo[]> {
        const authClient = AuthenticatedClient(account.httpkey, account.httpsecret, account.passphrase);
        const resp = await authClient.account().getCurrencies();
        return resp.map(wallet => ({ name: wallet.name, currency: wallet.currency }));
    }
}

export default OkexUtilsProxy;