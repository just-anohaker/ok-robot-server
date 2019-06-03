import Koa = require("koa");
import SocketIO = require("socket.io");
import { MarkedMap } from "../../../src";

export interface IHttp {
    readonly Name: string;

    onBind(koa: Koa): void;

    onRouter(): void;
}

export interface ISockerIO {
    readonly Name: string;

    onBindIO(io: SocketIO.Server): void;
}

export function koaResponse(ctx: Koa.Context, data: MarkedMap): void {
    ctx.body = data;
}

export default IHttp;