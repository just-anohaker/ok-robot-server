import Proxy from "../../../patterns/proxy/Proxy";
declare class OkexMonitProxy extends Proxy {
    static readonly NAME: string;
    private _okexConnection?;
    private _registerChannels;
    private _expiredTimeoutHandler?;
    constructor();
    onRegister(): void;
    private _checkOkexConnection;
    monitSpotTrade(instrumentId: string): {
        result: boolean;
        notificationName: string;
    };
    unmonitSpotTrade(instrumentId: string): {
        result: boolean;
        notificationName: string;
    };
    monitSpotTicker(instrumentId: string): {
        result: boolean;
        notificationName: string;
    };
    unmonitSpotTicker(instrumentId: string): {
        result: boolean;
        notificationName: string;
    };
    monitSpotChannel(channelName: string): {
        result: boolean;
        notificationName: string;
    };
    unmonitSpotChannel(channelName: string): {
        result: boolean;
        notificationName: string;
    };
    private onOkexConnectionOpened;
    private onOkexConnectionClosed;
    private onOkexConnectionMessage;
}
export default OkexMonitProxy;
