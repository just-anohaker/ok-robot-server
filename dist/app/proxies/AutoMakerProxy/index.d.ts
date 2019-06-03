import Proxy from "../../../patterns/proxy/Proxy";
import { AutoMakerOptions, OKexAccount } from "../../Types";
declare class AutoMakerProxy extends Proxy {
    static readonly NAME: string;
    constructor();
    onRegister(): void;
    init(options: AutoMakerOptions, account: OKexAccount): void;
    stop(): boolean;
    start(): boolean;
    isRunning(): boolean;
    readonly OptionsAndAccount: {
        options: AutoMakerOptions;
        account: OKexAccount;
    } | undefined;
}
export default AutoMakerProxy;
