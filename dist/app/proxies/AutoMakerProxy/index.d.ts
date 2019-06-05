import Proxy from "../../../patterns/proxy/Proxy";
declare class AutoMakerProxy extends Proxy {
    static readonly NAME: string;
    constructor();
    onRegister(): void;
    init(options: any, account: any): any;
    stop(): boolean;
    start(): boolean;
    isRunning(): boolean;
    readonly OptionsAndAccount: {
        options: any;
        account: any;
    } | undefined;
}
export default AutoMakerProxy;
