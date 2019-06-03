import Proxy from "../../../patterns/proxy/Proxy";
import { OKexAccount, TakeOrderOptions } from "../../Types";
declare class TakeOrderProxy extends Proxy {
    static readonly NAME: string;
    constructor();
    onRegister(): void;
    generate(options: TakeOrderOptions, account: OKexAccount): any;
    start(client_oids: string[]): boolean;
}
export default TakeOrderProxy;
