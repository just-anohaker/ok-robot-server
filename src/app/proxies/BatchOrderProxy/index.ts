import Proxy from "../../../patterns/proxy/Proxy";
import { Facade } from "../../..";
import { OKexAccount, BatchOrderOptions, BatchOrderCancelOptions } from "../../Types";

import  batchOrder from "./batchOrder";
class BatchOrderProxy extends Proxy {
    static readonly NAME: string = "PROXY_BATCH_ORDER";

    constructor() {
        super(BatchOrderProxy.NAME);
    }

    onRegister() {
        // TODO
    }

    async generate(options: any /*BatchOrderOptions*/, account: any /*OKexAccount*/): Promise<any> {
        // TODO
        return await batchOrder.genBatchOrder(options,account);
    }

    // start(client_oids: any /*string[]*/): boolean {
    //     // TODO
    //     return batchOrder.startBatchOrder(client_oids);
    // }

    async  cancel(options: any /*BatchOrderCancelOptions*/, account: any /*OKexAccount*/): Promise<any> {
        // TODO
        return await batchOrder.cancelBatchOrder(options,account);
    }
    async  limitOrder(options: any /*BatchOrderCancelOptions*/, account: any /*OKexAccount*/): Promise<any> {
        // TODO
        return await batchOrder.limitOrder(options,account);
    }
    async marketOrder(options: any /*BatchOrderCancelOptions*/, account: any /*OKexAccount*/): Promise<any> {
        // TODO
        return await batchOrder.marketOrder(options,account);
    }
}

export default BatchOrderProxy;