import Proxy from "../../../patterns/proxy/Proxy";
import {
    OkexTradeParameters,
    OkexCandlesParameters,
    OkexTickerParameters
} from "../../Types";

import { PublicClient } from "@okfe/okex-node"

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
}

export default OkexUtilsProxy;