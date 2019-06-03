import Koa = require("koa");
import KoaRouter = require("koa-router");
import SocketIO = require("socket.io");

import { IHttp, ISockerIO, koaResponse } from "../http";
import Application from "../../../Application";

// /> 
import { apiVolumeMaker, INotification } from "../../../../src";
import { Facade, IObserver, Observer } from "../../../../src";
import { NotificationDeep, NotificationTicker, NotificationOrder } from "../../../../src";

class VolumeMakerAPI implements IHttp, ISockerIO {
    private _http?: Koa;

    private _observer: IObserver;
    private _io?: SocketIO.Server;

    constructor() {
        this._observer = new Observer(this.onNotificationHandler, this);
    }

    get Name(): string {
        return "API_VOLUME_MAKER";
    }

    onBind(koa: Koa): void {
        this._http = koa;
    }

    onRouter(): void {
        const router = new KoaRouter();

        router.post("/api/volumeMaker/setOptions", this.setOptions);
        router.post("/api/volumeMaker/start", this.start);
        router.post("/api/volumeMaker/stop", this.stop);

        this._http!.use(router.routes());
    }

    onBindIO(io: SocketIO.Server): void {
        this._io = io;

        Facade.getInstance().registerObserver(NotificationDeep, this._observer);
        Facade.getInstance().registerObserver(NotificationTicker, this._observer);
        Facade.getInstance().registerObserver(NotificationOrder, this._observer);

        // setInterval(() => {
        //     console.log("begin socket io emit: hello", (this._io !== undefined ? "valid" : "invalid"));
        //     this._io!.emit("hello", { number: Math.round(Math.random() * 1000) });
        //     console.log("end socket io emit");
        // }, 10 * 1000);
    }

    private setOptions = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiVolumeMaker.setAutoTradeOptions(ctx.query || {}));
    }

    private start = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiVolumeMaker.startAutoTrade());
    }

    private stop = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiVolumeMaker.stopAutoTrade());
    }

    private onNotificationHandler(notification: INotification): void {
        console.log("[API_VOLUME_MAKER] io emit:", notification.getName(), this._io);
        this._io!.emit(notification.getName(), notification.getBody());
    }
}

const volumeMakerAPI = new VolumeMakerAPI();
Application.getInstance().registerHttp(volumeMakerAPI);
Application.getInstance().registerSocketIO(volumeMakerAPI);
