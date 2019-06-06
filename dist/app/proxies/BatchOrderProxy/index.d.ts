import Proxy from "../../../patterns/proxy/Proxy";
declare class BatchOrderProxy extends Proxy {
    static readonly NAME: string;
    private accountInfo;
    constructor();
    onRegister(): void;
    generate(options: any, account: any): Promise<any>;
    cancel(options: any, account: any): Promise<any>;
    limitOrder(options: any, account: any): Promise<any>;
    marketOrder(options: any, account: any): Promise<any>;
    startDepInfo(account: any): Promise<any>;
    private onEventHandler;
}
export default BatchOrderProxy;
