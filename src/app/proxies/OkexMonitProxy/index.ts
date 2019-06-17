import { V3WebsocketClient } from "@okfe/okex-node";
import Proxy from "../../../patterns/proxy/Proxy";
import Facade from "../../../patterns/facade/Facade";
import DepthMonitor from "./internal/DepthMonitor";
import { OKexAccount } from "../../Types";

const enum ChannelTAGs {
    SpotTrade = "spot/trade",
    SpotTicker = "spot/ticker"
}

const ExpiredTimeout = 30000;

class OkexMonitProxy extends Proxy {
    static readonly NAME: string = "PROXY_OKEX_MONIT";

    private _okexConnection?: V3WebsocketClient;
    private _okexDepthMonitor: Array<DepthMonitor>
    private _registerChannels: Map<string, boolean>
    private _expiredTimeoutHandler?: NodeJS.Timeout;
    constructor() {
        super(OkexMonitProxy.NAME);

        this._registerChannels = new Map<string, boolean>();
        this._okexDepthMonitor = [];
    }

    onRegister() {
        // TODO

        // initialize okex connection
        this._checkOkexConnection();
    }

    private _startExpiredTimer(): void {
        this._stopExpiredTimer();

        this._expiredTimeoutHandler = setTimeout(() => {
            console.log("[OkexMonitProxy] ExpiredTimeout happened");
            this._expiredTimeoutHandler = undefined;
            if (this._okexConnection) {
                const holdOkexConnection = this._okexConnection;
                this._okexConnection = undefined;
                return holdOkexConnection.close();
            }
            this._checkOkexConnection();
        }, ExpiredTimeout);
    }

    private _stopExpiredTimer(): void {
        if (this._expiredTimeoutHandler !== undefined) {
            clearTimeout(this._expiredTimeoutHandler);
            this._expiredTimeoutHandler = undefined;
        }
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

            this._okexConnection.connect();
            this._startExpiredTimer();
        }
        return this._okexConnection;
    }

    monitSpotTrade(instrumentId: string): string {
        return this.monitChannel(`${ChannelTAGs.SpotTrade}:${instrumentId}`);
    }

    unmonitSpotTrade(instrumentId: string): string {
        return this.unmonitChannel(`${ChannelTAGs.SpotTrade}:${instrumentId}`);
    }

    monitSpotTicker(instrumentId: string): string {
        return this.monitChannel(`${ChannelTAGs.SpotTicker}:${instrumentId}`);
    }

    unmonitSpotTicker(instrumentId: string): string {
        return this.unmonitChannel(`${ChannelTAGs.SpotTicker}:${instrumentId}`);
    }

    monitSpotChannel(channelName: string, filter: string): string {
        return this.monitChannel(`spot/${channelName}:${filter}`);
    }

    unmonitSpotChannel(channelName: string, filter: string): string {
        return this.unmonitChannel(`spot/${channelName}:${filter}`);
    }

    monitChannel(channelName: string): string {
        const okexConnection = this._checkOkexConnection();
        if (!this._registerChannels.has(channelName) ||
            this._registerChannels.get(channelName) === false) {
            try {
                okexConnection.subscribe(channelName);
                this._registerChannels.set(channelName, true);
                console.log(`[OkexMonitProxy] subscribe(${channelName}) success.`);
            } catch (error) {
                console.log(`[OkexMonitProxy] subscribe(${channelName}) failure, exception: ${error}.`);
                this.onOkexConnectionClosed();
                throw error;
            }
        }
        return channelName;
    }

    unmonitChannel(channelName: string): string {
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

        return channelName;
    }

    async monitDepth(account: OKexAccount, instrucment_id: string): Promise<string> {
        const found = this._okexDepthMonitor.filter(monitor => monitor.compareAccount(account));
        let depthMonitor: DepthMonitor;
        if (found.length <= 0) {
            depthMonitor = new DepthMonitor(account.httpkey, account.httpsecret, account.passphrase);
            this._okexDepthMonitor.push(depthMonitor);
        } else {
            depthMonitor = found[0];
        }
        return await depthMonitor.monit(instrucment_id);
    }

    async unmonitDepth(account: OKexAccount, instrucment_id: string): Promise<string> {
        const found = this._okexDepthMonitor.filter(monitor => monitor.compareAccount(account));
        if (found.length > 0) {
            return await found[0].unmonit(instrucment_id);
        }

        return "spot/depth:" + instrucment_id;
    }

    private onOkexConnectionOpened(): void {
        console.log("[OkexMonitProxy] okexConnection opened");
        this._stopExpiredTimer();
        this._registerChannels.forEach((value, key) => {
            if (value === true) {
                this._okexConnection.subscribe(key);
            }
        });
    }

    private onOkexConnectionClosed(): void {
        console.log("[OkexMonitProxy] okexConnection closed");
        this._okexConnection = undefined;
        this._stopExpiredTimer();
        this._checkOkexConnection();
    }

    private onOkexConnectionMessage(data: any): void {
        // console.log("[OkexMonitProxy] okexConnection message recieved:", typeof data, data);
        try {
            const jsonData = JSON.parse(data);
            if (jsonData.event && typeof jsonData.event === "string") {
                if (jsonData.event === "login") {
                    /// TODO: login
                } else if (jsonData.event === "error") {
                    console.log("[OkexMonitProxy] okexConnection error:", jsonData.errorCode, jsonData.message);
                } else {
                    console.log("[OkexMonitProxy] okexConnection message:", jsonData.event, jsonData.channel);
                }
            } else if (jsonData.table && typeof jsonData.table === "string") {
                const respData = jsonData.data;
                if (Array.isArray(respData) && respData.length > 0) {
                    const notificationName = jsonData.table + ":" + respData[0].instrument_id;
                    Facade.getInstance().sendNotification(notificationName, respData);
                }
            } else {
                console.log("[OkexMonitProxy] onOkexConnectionMessage unhandle:", data);
            }
        } catch (error) {
            console.log("[OkexMonitProxy] exception:", error);
        }
    }
}

export default OkexMonitProxy;