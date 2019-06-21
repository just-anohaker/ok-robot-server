import Proxy from "../../../patterns/proxy/Proxy";
declare class BatchOrderProxy extends Proxy {
    static readonly NAME: string;
    private accountInfo;
    constructor();
    onRegister(): void;
    generate(options: any, account: any): Promise<any>;
    toBatchOrder(options: any, account: any): Promise<any>;
    cancel(options: any, account: any): Promise<any>;
    limitOrder(options: any, account: any): Promise<any>;
    marketOrder(options: any, account: any): Promise<any>;
    pageInfo(options: any): Promise<any>;
    pageKline(options: any): Promise<any>;
    stopDepInfo(options: any): Promise<any>;
    getOrderData(options: any, account: any): Promise<any>;
    getTradeData(options: any): Promise<any>;
    getCandlesData(options: any): Promise<any>;
    startDepInfo(options: any): Promise<any>;
    private onEventHandler;
}
export default BatchOrderProxy;
