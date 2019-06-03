import Proxy from "../../../patterns/proxy/Proxy";
import { Facade } from "../../..";
import { OKexAccount, BatchOrderOptions } from "../../Types";

class BatchOrderProxy extends Proxy {
    static readonly NAME: string = "PROXY_BATCH_ORDER";

    constructor() {
        super(BatchOrderProxy.NAME);
    }

    onRegister() {
        // TODO
    }

    generate(options: BatchOrderOptions, account: OKexAccount): any {
        // TODO
        return undefined;
    }

    start(client_oids: string[]): boolean {
        // TODO
        return false;
    }
}

export default BatchOrderProxy;