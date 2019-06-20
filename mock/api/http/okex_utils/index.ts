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
        return "API_OKEX_UTILS";
    }

    onBind(koa: Koa): void {
        this._http = koa;
    }

    onRouter() {
        const router = new KoaRouter();

        router.post("/api/okex_utils/getSpotTrade", this.getSpotTrade);
        router.post("/api/okex_utils/getSpotTicker", this.getSpotTicker);
        router.post("/api/okex_utils/getSpotCandles", this.getSpotCandles);
        router.post("/api/okex_utils/getWallet", this.getWallet);
        router.post("/api/okex_utils/getWalletList", this.getWalletList);

        this._http!.use(router.routes());
    }

    onBindIO(io: SocketIO.Server): void {
        this._io = io;

        // TODO
        // Facade.getInstance().registerObserver(NotificationDeep, this._observer);
        // Facade.getInstance().registerObserver(NotificationTicker, this._observer);
        // Facade.getInstance().registerObserver(NotificationOrder, this._observer);

    }

    private getSpotTrade = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiOkexUtils.getSpotTrade(ctx.body || {}));
    }

    private getSpotTicker = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiOkexUtils.getSpotTicker(ctx.body || {}));
    }

    private getSpotCandles = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiOkexUtils.getSpotCandles(ctx.body || {}));
    }

    private getWallet = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiOkexUtils.getWallet(ctx.body || {}));
    }

    private getWalletList = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiOkexUtils.getWalletList(ctx.body || {}));
    }

    private onNotification = (notification: INotification): void => {
        // console.log("[TakeOrderAPI] onNotification:", notification.getName());
        this._io!.emit(notification.getName(), notification.getBody());
    }
}

const inst = new OkexUtilsAPI();
Application.getInstance().registerHttp(inst);
Application.getInstance().registerSocketIO(inst);