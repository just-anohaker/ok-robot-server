import Koa = require("koa");
import KoaRouter = require("koa-router");
import SocketIO = require("socket.io");

import IHttp, { koaResponse, ISockerIO } from "../http";
import Application from "../../../Application";

// /> 
import { apiUser, apiBatchOrder } from "../../../../src";
import { IObserver, Observer, INotification } from "../../../../src";
import { Facade } from "../../../../src";

class BatchOrderAPI implements IHttp, ISockerIO {
    private _http?: Koa;
    private _io?: SocketIO.Server;

    private _observer: IObserver;
    constructor() {
        this._observer = new Observer(this.onNotification, this);
    }

    get Name(): string {
        return "API_BATCH_ORDER";
    }

    onBind(koa: Koa): void {
        this._http = koa;
    }

    onRouter() {
        const router = new KoaRouter();

        router.post("/api/batch_order/gen", this.generate);
        //  router.post("/api/batch_order", this.start);
        router.post("/api/batch_order/cancel", this.cancel);
        router.post("/api/batch_order/limitOrder", this.limitOrder);
        router.post("/api/batch_order/marketOrder", this.marketOrder);
        router.post("/api/batch_order/startDepInfo", this.startDepInfo);
        router.post("/api/batch_order/stopDepInfo", this.stopDepInfo);
        router.post("/api/batch_order/getOrderData", this.getOrderData);
        router.post("/api/batch_order/pageInfo", this.pageInfo);
        router.post("/api/batch_order/pageKline", this.pageKline);
        router.post("/api/batch_order/getTradeData", this.getTradeData);
        router.post("/api/batch_order/getCandlesData", this.getCandlesData);


        this._http!.use(router.routes());
    }

    onBindIO(io: SocketIO.Server): void {
        this._io = io;

        // TODO
        // Facade.getInstance().registerObserver(NotificationDeep, this._observer);
        // Facade.getInstance().registerObserver(NotificationTicker, this._observer);
        // Facade.getInstance().registerObserver(NotificationOrder, this._observer);

        Facade.getInstance().registerObserver("depth", this._observer);
        Facade.getInstance().registerObserver("page/candle:ETM-USDT", this._observer);
        Facade.getInstance().registerObserver("page/candle:ETM-USDK", this._observer);
        Facade.getInstance().registerObserver("page/ticker:ETM-USDT", this._observer);
        Facade.getInstance().registerObserver("page/ticker:ETM-USDK", this._observer);
        Facade.getInstance().registerObserver("page/trade:ETM-USDT", this._observer);
        Facade.getInstance().registerObserver("page/trade:ETM-USDK", this._observer);
    }

    private generate = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiBatchOrder.generate(ctx.body || {}));
    }

    // private start = async (ctx: Koa.Context) => {
    //     koaResponse(ctx, await apiBatchOrder.start(ctx.body || {}));
    // }

    private cancel = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiBatchOrder.cancel(ctx.body || {}));
    }

    private limitOrder = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiBatchOrder.limitOrder(ctx.body || {}));
    }

    private marketOrder = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiBatchOrder.marketOrder(ctx.body || {}));
    }

    private startDepInfo = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiBatchOrder.startDepInfo(ctx.body || {}));
    }

    private stopDepInfo = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiBatchOrder.stopDepInfo(ctx.body || {}));
    }

    private getOrderData = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiBatchOrder.getOrderData(ctx.body || {}));
    }
    private getCandlesData = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiBatchOrder.getCandlesData(ctx.body || {}));
    }
    private getTradeData = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiBatchOrder.getTradeData(ctx.body || {}));
    }
    private pageInfo = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiBatchOrder.pageInfo(ctx.body || {}));
    }

    private pageKline = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiBatchOrder.pageKline(ctx.body || {}));
    }

    private onNotification = (notification: INotification): void => {
        // console.log("[BatchOrderAPI] onNotification:", notification.getName());
        this._io!.emit(notification.getName(), notification.getBody());
    }
}

const inst = new BatchOrderAPI();
Application.getInstance().registerHttp(inst);
Application.getInstance().registerSocketIO(inst);