import Proxy from "../../../patterns/proxy/Proxy";
import { Facade } from "../../..";
import { AutoMakerOptions, OKexAccount, TradeType } from "../../Types";
import autoMaker from "./autoMaker";
class AutoMakerProxy extends Proxy {
    static readonly NAME: string = "PROXY_AUTO_MAKER";

    constructor() {
        super(AutoMakerProxy.NAME);
    }

    onRegister() {
        // TODO
    }

    init(options: any /* AutoMakerOptions*/, account: any /*OKexAccount*/): any {
        console.log("initAutoMaker")
        return autoMaker.initAutoMaker(options, account)
    }

    stop(): boolean {
        return autoMaker.stopAutoTrade();
    }

    start(): boolean {
        return autoMaker.startAutoTrade();
    }

    isRunning(): boolean {
        return autoMaker.isRunning();
    }

    get OptionsAndAccount(): { options: any /*AutoMakerOptions*/; account: any /*OKexAccount*/ } | undefined {
        let p = autoMaker.getParamsAndAcct()
        return {
            options: p.params,
            account: p.acct
        };
    }
}

export default AutoMakerProxy;