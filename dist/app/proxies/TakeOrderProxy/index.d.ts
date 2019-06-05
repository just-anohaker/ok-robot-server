import Proxy from "../../../patterns/proxy/Proxy";
declare class TakeOrderProxy extends Proxy {
    static readonly NAME: string;
    constructor();
    onRegister(): void;
    generate(options: any, account: any): any;
    start(client_oids: any): boolean;
}
export default TakeOrderProxy;
