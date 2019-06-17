import Proxy from "../../../patterns/proxy/Proxy";
import { OKexAccount } from "../../Types";
declare class OkexMonitProxy extends Proxy {
    static readonly NAME: string;
    private _okexConnection?;
    private _okexDepthMonitor;
    private _registerChannels;
    private _expiredTimeoutHandler?;
    constructor();
    onRegister(): void;
    private _startExpiredTimer;
    private _stopExpiredTimer;
    private _checkOkexConnection;
    monitSpotTrade(instrumentId: string): string;
    unmonitSpotTrade(instrumentId: string): string;
    monitSpotTicker(instrumentId: string): string;
    unmonitSpotTicker(instrumentId: string): string;
    monitSpotChannel(channelName: string, filter: string): string;
    unmonitSpotChannel(channelName: string, filter: string): string;
    monitChannel(channelName: string): string;
    unmonitChannel(channelName: string): string;
    monitDepth(account: OKexAccount, instrucment_id: string): Promise<string>;
    unmonitDepth(account: OKexAccount, instrucment_id: string): Promise<string>;
    private onOkexConnectionOpened;
    private onOkexConnectionClosed;
    private onOkexConnectionMessage;
}
export default OkexMonitProxy;
