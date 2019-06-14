import Koa = require("koa");
import KoaRouter = require("koa-router");
import SocketIO = require("socket.io");

import IHttp, { koaResponse, ISockerIO } from "../http";
import Application from "../../../Application";

// /> 
import { apiOkexMonit, IObserver, Observer, INotification, MarkedMap, Facade } from "../../../../src";

class OkexMonitAPI implements IHttp, ISockerIO {
    private _http?: Koa;
    private _io?: SocketIO.Server;

    private _observer: IObserver;

    private _channelNames: Map<string, number>;
    constructor() {
        this._observer = new Observer(this.onNotification, this);
        this._channelNames = new Map<string, number>();
    }

    get Name(): string {
        return "API_OKEX_MONIT";
    }

    onBind(koa: Koa): void {
        this._http = koa;
    }

    onRouter() {
        const router = new KoaRouter();

        router.post("/api/okex_monitor/spotTrade",
            async (ctx: Koa.Context) => await this.monitSpotTrade(ctx));
        router.post("/api/okex_monitor/spotTrade/unmonit",
            async (ctx: Koa.Context) => await this.unmonitSpotTrade(ctx));
        router.post("/api/okex_monitor/spotTicker",
            async (ctx: Koa.Context) => await this.monitSpotTicker(ctx));
        router.post("/api/okex_monitor/spotTicker/unmonit",
            async (ctx: Koa.Context) => await this.unmonitSpotTicker(ctx));
        router.post("/api/okex_monitor/spotChannel",
            async (ctx: Koa.Context) => await this.monitSpotChannel(ctx));
        router.post("/api/okex_monitor/spotChannel/unmonit",
            async (ctx: Koa.Context) => await this.unmonitSpotChannel(ctx));

        this._http!.use(router.routes());
    }

    onBindIO(io: SocketIO.Server): void {
        this._io = io;

        // TODO
        // Facade.getInstance().registerObserver(NotificationDeep, this._observer);
        // Facade.getInstance().registerObserver(NotificationTicker, this._observer);
        // Facade.getInstance().registerObserver(NotificationOrder, this._observer);

    }

    private _registerObserver(eventName: string): void {
        if (!this._channelNames.has(eventName)) {
            console.log("registerObserver:", eventName);
            Facade.getInstance().registerObserver(eventName, this._observer);
            this._channelNames.set(eventName, 1);
        } else {
            this._channelNames.set(eventName, this._channelNames.get(eventName) + 1);
        }
    }

    private _unregisterObserver(eventName: string): void {
        if (!this._channelNames.has(eventName)) {
            return;
        }
        const count = this._channelNames.get(eventName);
        if (count > 1) {
            this._channelNames.set(eventName, count - 1);
            return;
        }

        console.log("unregisterObserver:", eventName);
        Facade.getInstance().removeObserver(eventName, this);
        this._channelNames.delete(eventName);
    }

    private async monitSpotTrade(ctx: Koa.Context) {
        const resp = await apiOkexMonit.monitSpotTrade(ctx.body || {});
        if (resp.success) {
            const eventName: string = resp.result as string;
            this._registerObserver(eventName);
        }
        koaResponse(ctx, resp);
    }

    private async unmonitSpotTrade(ctx: Koa.Context) {
        const resp = await apiOkexMonit.unmonitSpotTrade(ctx.body || {});
        if (resp.success) {
            const eventName: string = resp.result as string;
            this._unregisterObserver(eventName);
        }
        koaResponse(ctx, resp);
    }

    private async monitSpotTicker(ctx: Koa.Context) {
        const resp = await apiOkexMonit.monitSpotTicker(ctx.body || {});
        if (resp.success) {
            const eventName: string = resp.result as string;
            this._registerObserver(eventName);
        }
        koaResponse(ctx, resp);
    }

    private async unmonitSpotTicker(ctx: Koa.Context) {
        const resp = await apiOkexMonit.unmonitSpotTicker(ctx.body || {});
        if (resp.success) {
            const eventName: string = resp.result as string;
            this._unregisterObserver(eventName);
        }
        koaResponse(ctx, resp);
    }

    private async monitSpotChannel(ctx: Koa.Context) {
        const resp = await apiOkexMonit.monitSpotChannel(ctx.body || {});
        if (resp.success) {
            const eventName: string = resp.result as string;
            this._registerObserver(eventName);
        }
        koaResponse(ctx, resp);
    }

    private async unmonitSpotChannel(ctx: Koa.Context) {
        const resp = await apiOkexMonit.unmonitSpotChannel(ctx.body || {});
        if (resp.success) {
            const eventName: string = resp.result as string;
            this._unregisterObserver(eventName);
        }
        koaResponse(ctx, resp);
    }

    private onNotification = (notification: INotification): void => {
        console.log("[OkexMonitAPI] onNotification:", notification.getName(), notification.getBody());
        this._io!.emit(notification.getName(), notification.getBody());
    }
}

const inst = new OkexMonitAPI();
Application.getInstance().registerHttp(inst);
Application.getInstance().registerSocketIO(inst);