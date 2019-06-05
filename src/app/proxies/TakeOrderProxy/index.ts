import Proxy from "../../../patterns/proxy/Proxy";
import { Facade } from "../../..";
import { OKexAccount, TakeOrderOptions } from "../../Types";

class TakeOrderProxy extends Proxy {
    static readonly NAME: string = "PROXY_TAKE_ORDER";

    constructor() {
        super(TakeOrderProxy.NAME);
    }

    onRegister() {
        // TODO
    }

    generate(options: any /*TakeOrderOptions*/, account: any /*OKexAccount*/): any {
        // TODO
        return undefined;
    }

    start(client_oids: any /*string[]*/): boolean {
        // TODO
        return false;
    }
}

export default TakeOrderProxy;