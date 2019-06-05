import Proxy from "../../../patterns/proxy/Proxy";
import { Facade } from "../../..";
import { AutoMakerOptions, OKexAccount, TradeType } from "../../Types";

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
    }

    stop(): boolean {
        // TODO
        return true;
    }

    start(): boolean {
        // TODO
        return true;
    }

    isRunning(): boolean {
        // TODO
        return true;
    }

    get OptionsAndAccount(): { options: any /*AutoMakerOptions*/; account: any /*OKexAccount*/ } | undefined {
        // TODO
        return undefined;
    }
}

export default AutoMakerProxy;