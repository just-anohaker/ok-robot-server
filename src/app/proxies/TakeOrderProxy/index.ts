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

    generate(options: TakeOrderOptions, account: OKexAccount): any {
        // TODO
        return undefined;
    }

    start(client_oids: string[]): boolean {
        // TODO
        return false;
    }
}

export default TakeOrderProxy;