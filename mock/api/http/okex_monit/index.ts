import Koa = require("koa");
import KoaRouter = require("koa-router");
import SocketIO = require("socket.io");

import IHttp, { koaResponse, ISockerIO } from "../http";
import Application from "../../../Application";

// /> 
import { apiOkexMonit, IObserver, Observer, INotification } from "../../../../src";

class OkexMonitAPI implements IHttp, ISockerIO {
    private _http?: Koa;
    private _io?: SocketIO.Server;

    private _observer: IObserver;
    constructor() {
        this._observer = new Observer(this.onNotification, this);
    }

    get Name(): string {
        return "API_OKEX_MONIT";
    }

    onBind(koa: Koa): void {
        this._http = koa;
    }

    onRouter() {
        const router = new KoaRouter();

        router.post("/api/okex_monit/spotTrade",
            async (ctx: Koa.Context) => await this.monitSpotTrade(ctx));
        router.post("/api/okex_monit/spotTrade/unmonit",
            async (ctx: Koa.Context) => await this.unmonitSpotTrade(ctx));
        router.post("/api/okex_monit/spotTicker",
            async (ctx: Koa.Context) => await this.monitSpotTicker(ctx));
        router.post("/api/okex_monit/spotTicker/unmonit",
            async (ctx: Koa.Context) => await this.unmonitSpotTicker(ctx));

        this._http!.use(router.routes());
    }

    onBindIO(io: SocketIO.Server): void {
        this._io = io;

        // TODO
        // Facade.getInstance().registerObserver(NotificationDeep, this._observer);
        // Facade.getInstance().registerObserver(NotificationTicker, this._observer);
        // Facade.getInstance().registerObserver(NotificationOrder, this._observer);

    }

    private async monitSpotTrade(ctx: Koa.Context) {
        const resp = await apiOkexMonit.monitSpotTrade(ctx.body || {});
        if (resp.success) {
            // TODO: register event
        }
        koaResponse(ctx, resp);
        // koaResponse(ctx, await apiOkexMonit.monitSpotTrade(ctx.body || {}));
    }

    private async unmonitSpotTrade(ctx: Koa.Context) {
        const resp = await apiOkexMonit.unmonitSpotTrade(ctx.body || {});
        if (resp.success) {
            // TODO: unregister event
        }
        koaResponse(ctx, resp);
        // koaResponse(ctx, await apiOkexMonit.unmonitSpotTrade(ctx.body || {}));
    }

    private async monitSpotTicker(ctx: Koa.Context) {
        const resp = await apiOkexMonit.monitSpotTicker(ctx.body || {});
        if (resp.success) {
            // TODO
        }
        koaResponse(ctx, resp);
        // koaResponse(ctx, await apiOkexMonit.monitSpotTicker(ctx.body || {}));
    }

    private async unmonitSpotTicker(ctx: Koa.Context) {
        const resp = await apiOkexMonit.unmonitSpotTicker(ctx.body || {});
        if (resp.success) {
            // TODO
        }
        koaResponse(ctx, resp);
        // koaResponse(ctx, await apiOkexMonit.unmonitSpotTicker(ctx.body || {}));
    }

    private onNotification = (notification: INotification): void => {
        // console.log("[TakeOrderAPI] onNotification:", notification.getName());
        this._io!.emit(notification.getName(), notification.getBody());
    }
}

const inst = new OkexMonitAPI();
Application.getInstance().registerHttp(inst);
Application.getInstance().registerSocketIO(inst);