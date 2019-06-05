import Proxy from "../../../patterns/proxy/Proxy";
import { Facade } from "../../..";
import { OKexAccount, BatchOrderOptions, BatchOrderCancelOptions } from "../../Types";

class BatchOrderProxy extends Proxy {
    static readonly NAME: string = "PROXY_BATCH_ORDER";

    constructor() {
        super(BatchOrderProxy.NAME);
    }

    onRegister() {
        // TODO
    }

    generate(options: any /*BatchOrderOptions*/, account: any /*OKexAccount*/): any {
        // TODO
        return undefined;
    }

    start(client_oids: any /*string[]*/): boolean {
        // TODO
        return false;
    }

    cancel(options: any /*BatchOrderCancelOptions*/, account: any /*OKexAccount*/): any {
        // TODO
        return undefined;
    }
}

export default BatchOrderProxy;