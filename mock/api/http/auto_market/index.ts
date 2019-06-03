import Koa = require("koa");
import KoaRouter = require("koa-router");
import SocketIO = require("socket.io");

import IHttp, { koaResponse, ISockerIO } from "../http";
import Application from "../../../Application";

// /> 
import { apiAutoMarket, IObserver, Observer, INotification } from "../../../../src";

class AutoMarketAPI implements IHttp, ISockerIO {
    private _http?: Koa;
    private _io?: SocketIO.Server;

    private _observer: IObserver;
    constructor() {
        this._observer = new Observer(this.onNotification, this);
    }

    get Name(): string {
        return "API_AUTO_MAKER";
    }

    onBind(koa: Koa): void {
        this._http = koa;
    }

    onRouter() {
        const router = new KoaRouter();

        router.post("/api/auto_market/", this.initAutoMarket);
        router.post("/api/auto_market/start", this.startAutoMarket);
        router.post("/api/auto_market/stop", this.stopAutoMarket);
        router.post("/api/auto_market/isrunning", this.isAutoMarketRunning);
        router.get("/api/auto_market", this.getOptionsAndAccount);

        this._http!.use(router.routes());
    }

    onBindIO(io: SocketIO.Server): void {
        this._io = io;

        // TODO
        // Facade.getInstance().registerObserver(NotificationDeep, this._observer);
        // Facade.getInstance().registerObserver(NotificationTicker, this._observer);
        // Facade.getInstance().registerObserver(NotificationOrder, this._observer);

    }

    private initAutoMarket = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiAutoMarket.init(ctx.body || {}));
    }

    private startAutoMarket = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiAutoMarket.start());
    }

    private stopAutoMarket = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiAutoMarket.stop());
    }

    private isAutoMarketRunning = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiAutoMarket.isrunning());
    }

    private getOptionsAndAccount = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiAutoMarket.optionAndAccount());
    }

    private onNotification = (notification: INotification): void => {
        console.log("[AutoMarketAPI] onNotification:", notification.getName());
        this._io!.emit(notification.getName(), notification.getBody());
    }
}

const inst = new AutoMarketAPI();
Application.getInstance().registerHttp(inst);
Application.getInstance().registerSocketIO(inst);