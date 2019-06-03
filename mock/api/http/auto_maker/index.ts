import Koa = require("koa");
import KoaRouter = require("koa-router");
import SocketIO = require("socket.io");

import IHttp, { koaResponse, ISockerIO } from "../http";
import Application from "../../../Application";

// /> 
import { apiAutoMaker, IObserver, Observer, INotification } from "../../../../src";

class AutoMakerAPI implements IHttp, ISockerIO {
    private _http?: Koa;
    private _io?: SocketIO.Server;

    private _observer: IObserver
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

        router.post("/api/auto_maker", this.initAutoMaker);
        router.post("/api/auto_maker/start", this.startAutoMaker);
        router.post("/api/auto_maker/stop", this.stopAutoMaker);
        router.post("/api/auto_maker/isrunning", this.isAutoMakerRunning);
        router.get("/api/auto_maker", this.getAutoMakerOptionsAndAccount);

        this._http!.use(router.routes());
    }

    onBindIO(io: SocketIO.Server): void {
        this._io = io;

        // TODO
        // Facade.getInstance().registerObserver(NotificationDeep, this._observer);
        // Facade.getInstance().registerObserver(NotificationTicker, this._observer);
        // Facade.getInstance().registerObserver(NotificationOrder, this._observer);

    }

    private initAutoMaker = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiAutoMaker.init(ctx.body || {}));
    }

    private startAutoMaker = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiAutoMaker.start());
    }

    private stopAutoMaker = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiAutoMaker.stop());
    }

    private isAutoMakerRunning = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiAutoMaker.isrunning());
    }

    private getAutoMakerOptionsAndAccount = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiAutoMaker.optionAndAccount());
    }

    private onNotification = (notification: INotification): void => {
        console.log("[AutoMakerAPI] onNotification:", notification.getName());
        this._io!.emit(notification.getName(), notification.getBody());
    }
}

const inst = new AutoMakerAPI();
Application.getInstance().registerHttp(inst);
Application.getInstance().registerSocketIO(inst);