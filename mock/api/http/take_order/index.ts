import Koa = require("koa");
import KoaRouter = require("koa-router");
import SocketIO = require("socket.io");

import IHttp, { koaResponse, ISockerIO } from "../http";
import Application from "../../../Application";

// /> 
import { apiTakeOrder, IObserver, Observer, INotification } from "../../../../src";

class TakeOrderAPI implements IHttp, ISockerIO {
    private _http?: Koa;
    private _io?: SocketIO.Server;

    private _observer: IObserver;
    constructor() {
        this._observer = new Observer(this.onNotification, this);
    }

    get Name(): string {
        return "API_TAKE_ORDER";
    }

    onBind(koa: Koa): void {
        this._http = koa;
    }

    onRouter() {
        const router = new KoaRouter();

        router.post("/api/take_order/gen", this.generate);
        router.post("/api/take_order", this.start);

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
        koaResponse(ctx, await apiTakeOrder.generate(ctx.body || {}));
    }

    private start = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiTakeOrder.start(ctx.body || {}));
    }

    private onNotification = (notification: INotification): void => {
        console.log("[TakeOrderAPI] onNotification:", notification.getName());
        this._io!.emit(notification.getName(), notification.getBody());
    }
}

const inst = new TakeOrderAPI();
Application.getInstance().registerHttp(inst);
Application.getInstance().registerSocketIO(inst);