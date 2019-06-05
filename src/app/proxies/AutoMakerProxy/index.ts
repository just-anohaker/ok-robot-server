import Proxy from "../../../patterns/proxy/Proxy";
import { Facade } from "../../..";
import { AutoMakerOptions, OKexAccount, TradeType } from "../../Types";
import  autoMaker from "./autoMaker";
class AutoMakerProxy extends Proxy {
    static readonly NAME: string = "PROXY_AUTO_MAKER";

    constructor() {
        super(AutoMakerProxy.NAME);
    }

    onRegister() {
        // TODO
    }

    init(options: any /* AutoMakerOptions*/, account: any /*OKexAccount*/): any {
        // TODO
        console.log("initAutoMaker")
        autoMaker.initAutoMaker(options,account)
    }

    stop(): boolean {
        // TODO
        return autoMaker.stopAutoTrade();
    }

    start(): boolean {
        // TODO
        return autoMaker.startAutoTrade();
    }

    isRunning(): boolean {
        // TODO
        return autoMaker.isRunning();
    }

    get OptionsAndAccount(): { options: any /*AutoMakerOptions*/; account: any /*OKexAccount*/ } | undefined {
        // TODO
        let p=autoMaker.getParamsAndAcct()
        return { options:p.params,
            account:p.acct};
    }
}

export default AutoMakerProxy;