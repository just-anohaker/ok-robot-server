import Proxy from "../../../patterns/proxy/Proxy";
import { OKexAccount, BatchOrderOptions } from "../../Types";
declare class BatchOrderProxy extends Proxy {
    static readonly NAME: string;
    constructor();
    onRegister(): void;
    generate(options: BatchOrderOptions, account: OKexAccount): any;
    start(client_oids: string[]): boolean;
}
export default BatchOrderProxy;
