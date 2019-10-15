import Proxy from "../../../patterns/proxy/Proxy";
import { Facade } from "../../..";
import { OKexAccount, BatchOrderOptions, BatchOrderCancelOptions } from "../../Types";

import batchOrder from "./batchOrder";
import AcctInfo, { AccountInfo } from "../../acctInfo2";

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
        let result;
        try {
            result = await batchOrder.genBatchOrder(options, account);
        } catch (error) {
            return {
                result: false,
                error_message: error + ''
            };
        }
        return result;
    }

    async toBatchOrder(options: any /*BatchOrderOptions*/, account: any /*OKexAccount*/): Promise<any> {
        let result;
        try {
            result = await batchOrder.toBatchOrder(options, account);
        } catch (error) {
            return {
                result: false,
                error_message: error + ''
            };
        }
        return result;
    }
    // start(client_oids: any /*string[]*/): boolean {
    //     return batchOrder.startBatchOrder(client_oids);
    // }

    async  cancel(options: any /*BatchOrderCancelOptions*/, account: any /*OKexAccount*/): Promise<any> {
        return await batchOrder.cancelBatchOrder(options, account);
    }

    async  limitOrder(options: any /*BatchOrderCancelOptions*/, account: any /*OKexAccount*/): Promise<any> {
        return await batchOrder.limitOrder(options, account);
    }

    async marketOrder(options: any /*BatchOrderCancelOptions*/, account: any /*OKexAccount*/): Promise<any> {
        return await batchOrder.marketOrder(options, account);
    }
    async pageInfo(options: any): Promise<any> {
        try {
            await batchOrder.pageInfo(options);
        } catch (error) {
            return {
                result: false,
                error_message: error
            };
        }
        return { result: true };
    }
    async pageKline(options: any): Promise<any> {
        return await batchOrder.pageKline(options);
    }
    async stopDepInfo(options: any): Promise<any> {
        return await batchOrder.stopDepInfo(options);
    }

    async getOrderData(options: any /*BatchOrderCancelOptions*/, account: any /*OKexAccount*/): Promise<any> {
        return await batchOrder.getOrderData(options, account);
    }
    async getTradeData(options: any /*BatchOrderCancelOptions*/): Promise<any> {
        return await batchOrder.getTradeData(options);
    }

    async getCandlesData(options: any /*BatchOrderCancelOptions*/): Promise<any> {
        return await batchOrder.getCandlesData(options);
    }

    async startDepInfo(options: any /*OKexAccount*/): Promise<any> {
        try {

            await batchOrder.startDepInfo(options);


        } catch (error) {
            return {
                result: false,
                error_message: error
            };
        }
        return { result: true };
    }
    async addWarnings(options: any, account: any ): Promise<any> {
        return await batchOrder.addWarnings(options,account);
    } 
    async removeWarnings(options: any, account: any ): Promise<any> {
        return await batchOrder.removeWarnings(options,account);
    } 

    async  stopWarnings(options: any, account: any ): Promise<any> {
        return await batchOrder.stopWarnings(options, account);
    }
    async  isWarnings(options: any, account: any ): Promise<any> {
        return await batchOrder.isWarnings(options, account);
    }
    async  startWarnings(options: any, account: any ): Promise<any> {
        return await batchOrder.startWarnings(options, account);
    }
    async  listWarnings(options: any, account: any ): Promise<any> {
        return await batchOrder.listWarnings(options, account);
    }
    private onEventHandler(eventName) {
        return data => {
            Facade.getInstance().sendNotification(eventName, data);
        };
    }
}

export default BatchOrderProxy;