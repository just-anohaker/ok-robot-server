import Proxy from "../../../patterns/proxy/Proxy";
import { Facade } from "../../..";
import { OKexAccount, BatchOrderOptions, BatchOrderCancelOptions } from "../../Types";

import batchOrder from "./batchOrder";
import AcctInfo from "../../acctInfo";

class BatchOrderProxy extends Proxy {
    static readonly NAME: string = "PROXY_BATCH_ORDER";

    private accountInfo: any[];

    constructor() {
        super(BatchOrderProxy.NAME);

        this.accountInfo = [];
    }

    onRegister() {
        // TODO
    }

    async generate(options: any /*BatchOrderOptions*/, account: any /*OKexAccount*/): Promise<any> {
        // TODO
        return await batchOrder.genBatchOrder(options, account);
    }

    // start(client_oids: any /*string[]*/): boolean {
    //     // TODO
    //     return batchOrder.startBatchOrder(client_oids);
    // }

    async  cancel(options: any /*BatchOrderCancelOptions*/, account: any /*OKexAccount*/): Promise<any> {
        // TODO
        return await batchOrder.cancelBatchOrder(options, account);
    }
    async  limitOrder(options: any /*BatchOrderCancelOptions*/, account: any /*OKexAccount*/): Promise<any> {
        // TODO
        return await batchOrder.limitOrder(options, account);
    }
    async marketOrder(options: any /*BatchOrderCancelOptions*/, account: any /*OKexAccount*/): Promise<any> {
        // TODO
        return await batchOrder.marketOrder(options, account);

    }
    async stopDepInfo(): Promise<any> {
        // TODO
        return await batchOrder.stopDepInfo();
    }
    async getOrderData(options: any /*BatchOrderCancelOptions*/, account: any /*OKexAccount*/): Promise<any> {
        // TODO
        return await batchOrder.getOrderData(options, account);
    }
    async startDepInfo(account: any /*OKexAccount*/): Promise<any> {

        try {
            let acctinfo = AcctInfo(account.httpkey, account.httpsecret, account.passphrase);
            const depthEventName = "depth";
            acctinfo.event.on(depthEventName, this.onEventHandler(depthEventName));
            this.accountInfo.push(acctinfo);

        } catch (error) {
            return {
                result: false,
                error_message: error
            };
        }
        return { result: true };
    }
    private onEventHandler(eventName) {
        return data => {
            Facade.getInstance().sendNotification(eventName, data);
        };
    }
}

export default BatchOrderProxy;