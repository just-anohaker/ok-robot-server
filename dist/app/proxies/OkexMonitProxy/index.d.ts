import Proxy from "../../../patterns/proxy/Proxy";
declare class OkexMonitProxy extends Proxy {
    static readonly NAME: string;
    private _okexConnection?;
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
    private onOkexConnectionOpened;
    private onOkexConnectionClosed;
    private onOkexConnectionMessage;
}
export default OkexMonitProxy;
