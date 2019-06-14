import { V3WebsocketClient } from "@okfe/okex-node";
import Proxy from "../../../patterns/proxy/Proxy";

const enum ChannelTAGs {
    SpotTrade = "spot/trade",
    SpotTicker = "spot/ticker"
}

const ExpiredTimeout = 30000;

class OkexMonitProxy extends Proxy {
    static readonly NAME: string = "PROXY_OKEX_MONIT";

    private _okexConnection?: V3WebsocketClient;
    private _registerChannels: Map<string, boolean>
    private _expiredTimeoutHandler?: NodeJS.Timeout;
    constructor() {
        super(OkexMonitProxy.NAME);

        this._registerChannels = new Map<string, boolean>();
    }

    onRegister() {
        // TODO

        // initialize okex connection
        this._checkOkexConnection();
    }

    private _checkOkexConnection(): V3WebsocketClient {

        if (this._okexConnection === undefined) {
            this._okexConnection = new V3WebsocketClient();

            this._okexConnection.on("open",
                () => this.onOkexConnectionOpened());
            this._okexConnection.on("close",
                () => this.onOkexConnectionClosed());
            this._okexConnection.on("message",
                (data: any) => this.onOkexConnectionMessage(data));

            this._registerChannels.forEach((value, key) => {
                if (value === true) {
                    this._okexConnection.subscribe(key);
                }
            });

            this._okexConnection.connect();
            if (this._expiredTimeoutHandler !== undefined) {
                clearTimeout(this._expiredTimeoutHandler);
                this._expiredTimeoutHandler = undefined;
            }
            this._expiredTimeoutHandler = setTimeout(() => {
                console.log("[OkexMonitProxy] ExpiredTimeout happened");
                this._expiredTimeoutHandler = undefined;
                if (this._okexConnection) {
                    return this._okexConnection.close();
                }
                this._checkOkexConnection();
            }, ExpiredTimeout);
        }
        return this._okexConnection;
    }

    monitSpotTrade(instrumentId: string): { result: boolean, notificationName: string } {
        return this.monitSpotChannel(`${ChannelTAGs.SpotTrade}:${instrumentId}`);
    }

    unmonitSpotTrade(instrumentId: string): { result: boolean, notificationName: string } {
        return this.unmonitSpotChannel(`${ChannelTAGs.SpotTrade}:${instrumentId}`);
    }

    monitSpotTicker(instrumentId: string): { result: boolean, notificationName: string } {
        return this.monitSpotChannel(`${ChannelTAGs.SpotTicker}:${instrumentId}`);
    }

    unmonitSpotTicker(instrumentId: string): { result: boolean, notificationName: string } {
        return this.unmonitSpotChannel(`${ChannelTAGs.SpotTicker}:${instrumentId}`);
    }

    monitSpotChannel(channelName: string): { result: boolean, notificationName: string } {
        const okexConnection = this._checkOkexConnection();
        if (!this._registerChannels.has(channelName) ||
            this._registerChannels.get(channelName) === false) {
            try {
                okexConnection.subscribe(channelName);
                this._registerChannels.set(channelName, true);
                console.log(`[OkexMonitProxy] subscribe(${channelName}) success.`);
            } catch (error) {
                console.log(`[OkexMonitProxy] subscribe(${channelName}) failure, exception: ${error}.`);
                throw error;
            }
        }
        return {
            result: true,
            notificationName: channelName
        };;
    }

    unmonitSpotChannel(channelName: string): { result: boolean, notificationName: string } {
        const okexConnection = this._checkOkexConnection();
        if (this._registerChannels.has(channelName) &&
            this._registerChannels.get(channelName) === true) {
            try {
                okexConnection.unsubscribe(channelName);
                this._registerChannels.set(channelName, false);
                console.log(`[OkexMonitProxy] unsubscribe(${channelName}) success.`);
            } catch (error) {
                console.log(`[OkexMonitProxy] unsubscribe(${channelName}) failure, exception: ${error}.`);
                throw error;
            }
        }

        return {
            result: true,
            notificationName: channelName
        };
    }

    private onOkexConnectionOpened(): void {
        console.log("[OkexMonitProxy] okexConnection opened");
        if (this._expiredTimeoutHandler !== undefined) {
            clearTimeout(this._expiredTimeoutHandler);
            this._expiredTimeoutHandler = undefined;
        }
    }

    private onOkexConnectionClosed(): void {
        console.log("[OkexMonitProxy] okexConnection closed");
        if (this._expiredTimeoutHandler !== undefined) {
            clearTimeout(this._expiredTimeoutHandler);
            this._expiredTimeoutHandler = undefined;
        }
        this._okexConnection = undefined;
        this._checkOkexConnection();
    }

    private onOkexConnectionMessage(data: any): void {
        console.log("[OkexMonitProxy] okexConnection message recieved:", data);

        // TODO
    }
}

export default OkexMonitProxy;