import Proxy from "../../../patterns/proxy/Proxy";
declare class BatchOrderProxy extends Proxy {
    static readonly NAME: string;
    constructor();
    onRegister(): void;
    generate(options: any, account: any): any;
    start(client_oids: any): boolean;
    cancel(options: any, account: any): any;
}
export default BatchOrderProxy;
