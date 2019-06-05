import Proxy from "../../../patterns/proxy/Proxy";
import { Facade } from "../../..";
import { OKexAccount, AutoMarketOptions } from "../../Types";

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
        return false;
    }

    get OptionsAndAccount(): { options: any /*AutoMarketOptions*/; account: any /*OKexAccount*/ } | undefined {
        // TODO
        return undefined;
    }
}

export default AutoMarketProxy;