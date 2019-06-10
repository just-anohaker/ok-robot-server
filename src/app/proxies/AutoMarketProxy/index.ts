import Proxy from "../../../patterns/proxy/Proxy";
import { Facade } from "../../..";
import { OKexAccount, AutoMarketOptions } from "../../Types";
import autoMarket from "./autoMarket";
class AutoMarketProxy extends Proxy {
    static readonly NAME: string = "PROXY_AUTO_MAKRET";

    constructor() {
        super(AutoMarketProxy.NAME);
    }

    onRegister() {
        // TODO
    }

    init(options: any /*AutoMarketOptions*/, account: any /*OKexAccount*/): any {
        // TODO
        autoMarket.initAutoMarket(options, account)
    }

    stop(): boolean {
        // TODO
        return false;
    }

    start(): boolean {
        // TODO
        return false
    }

    isRunning(): boolean {
        // TODO
        return autoMarket.isRunning();
    }

    get OptionsAndAccount(): { options: any /*AutoMarketOptions*/; account: any /*OKexAccount*/ } | undefined {
        // TODO
        let p = autoMarket.getParamsAndAcct()
        return {
            options: p.params,
            account: p.acct
        };
    }
}

export default AutoMarketProxy;