import Koa = require("koa");
import KoaRouter = require("koa-router");
import SocketIO = require("socket.io");

import IHttp, { koaResponse, ISockerIO } from "../http";
import Application from "../../../Application";

// /> 
import { apiOkexUtils, IObserver, Observer, INotification } from "../../../../src";

class OkexUtilsAPI implements IHttp, ISockerIO {
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

        router.post("/api/okex_utils/getSpotTrade", this.getSpotTrade);
        router.post("/api/okex_utils/getSpotTicker", this.getSpotTicker);
        router.post("/api/okex_utils/getSpotCandles", this.getSpotCandles);

        this._http!.use(router.routes());
    }

    onBindIO(io: SocketIO.Server): void {
        this._io = io;

        // TODO
        // Facade.getInstance().registerObserver(NotificationDeep, this._observer);
        // Facade.getInstance().registerObserver(NotificationTicker, this._observer);
        // Facade.getInstance().registerObserver(NotificationOrder, this._observer);

    }

    private getSpotTrade = (ctx: Koa.Context): void => {

    }

    private getSpotTicker = (ctx: Koa.Context): void => {

    }

    private getSpotCandles = (ctx: Koa.Context): void => {

    }

    private onNotification = (notification: INotification): void => {
        console.log("[TakeOrderAPI] onNotification:", notification.getName());
        this._io!.emit(notification.getName(), notification.getBody());
    }
}

const inst = new OkexUtilsAPI();
Application.getInstance().registerHttp(inst);
Application.getInstance().registerSocketIO(inst);