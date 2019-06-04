import Proxy from "../../../patterns/proxy/Proxy";
import { OKexAccount, AutoMarketOptions } from "../../Types";
declare class AutoMarketProxy extends Proxy {
    static readonly NAME: string;
    constructor();
    onRegister(): void;
    init(options: AutoMarketOptions, account: OKexAccount): void;
    stop(): boolean;
    start(): boolean;
    isRunning(): boolean;
    readonly OptionsAndAccount: {
        options: AutoMarketOptions;
        account: OKexAccount;
    } | undefined;
}
export default AutoMarketProxy;
