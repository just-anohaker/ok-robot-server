import Koa = require("koa");
import KoaRouter = require("koa-router");
import SocketIO = require("socket.io");

import IHttp, { koaResponse, ISockerIO } from "../http";
import Application from "../../../Application";

// /> 
import { apiUser, apiBatchOrder, IObserver, Observer, INotification } from "../../../../src";

class BatchOrderAPI implements IHttp, ISockerIO {
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

        router.post("/api/batch_order/gen", this.generate);
        router.post("/api/batch_order", this.start);

        this._http!.use(router.routes());
    }

    onBindIO(io: SocketIO.Server): void {
        this._io = io;

        // TODO
        // Facade.getInstance().registerObserver(NotificationDeep, this._observer);
        // Facade.getInstance().registerObserver(NotificationTicker, this._observer);
        // Facade.getInstance().registerObserver(NotificationOrder, this._observer);
    }

    private generate = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiBatchOrder.generate(ctx.body || {}));
    }

    private start = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiBatchOrder.start(ctx.body || {}));
    }

    private onNotification = (notification: INotification): void => {
        console.log("[BatchOrderAPI] onNotification:", notification.getName());
        this._io!.emit(notification.getName(), notification.getBody());
    }
}

const inst = new BatchOrderAPI();
Application.getInstance().registerHttp(inst);
Application.getInstance().registerSocketIO(inst);