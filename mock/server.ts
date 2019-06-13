import program = require("commander");
import Koa = require("koa");
import KoaBodyParser = require("koa-bodyparser")
import KoaCors = require("@koa/cors");
import SocketIO = require("socket.io");
import { Server } from "http";

import { Facade } from "../src";
import {
    UserMediator
} from "../src";
import {
    UserProxy,
    AutoMakerProxy,
    AutoMarketProxy,
    BatchOrderProxy,
    TakeOrderProxy,
    OkexUtilsProxy
} from "../src";

import Application from "./Application";
import "./api";

function initCore(): boolean {
    const facadeInst = Facade.getInstance();
    facadeInst.registerProxy(new UserProxy());
    facadeInst.registerProxy(new AutoMakerProxy());
    facadeInst.registerProxy(new AutoMarketProxy());
    facadeInst.registerProxy(new BatchOrderProxy());
    facadeInst.registerProxy(new TakeOrderProxy());
    facadeInst.registerProxy(new OkexUtilsProxy());

    facadeInst.registerMediator(new UserMediator());

    Application.getInstance().facade = facadeInst;
    return true;
}

function initApp(): boolean {
    const app = Application.getInstance();
    const koa = new Koa();
    // for socket.io
    const httpServer = new Server(koa.callback());
    const io = SocketIO(httpServer);
    app.http = koa;
    app.io = io;

    koa.on("error", (err, ctx) => {
        let reqInfo = null;
        if (ctx != null) {
            reqInfo = `${ctx.method}: ${ctx.path}`;
        }
        console.error(`[KOA] Error: ${err.toString()}${reqInfo == null ? "" : ", " + reqInfo}`);
    });

    koa.use(KoaBodyParser());

    koa.use(async (ctx, next) => {
        // Logger
        console.log(`[HTTP] ${ctx.method}: ${ctx.path}`);

        await next();
    });

    koa.use(async (ctx, next) => {
        ctx.body = ctx.request.body;
        await next();
    });

    koa.use(KoaCors());

    if (!app.initHttps()) {
        return false;
    }
    if (!app.initSocketIOs()) {
        return false;
    }
    koa.use(async ctx => {
        // TODO
        ctx.body = "hello world";
    });

    // listen
    httpServer.listen(app.port, app.host, () => {
        console.log(`[APP] Listenning on ${app.host}:${app.port}`);
    });
    return true;
}

function main(): void {
    program
        .version("1.0.0")
        .option("-h, --host <hostname>", "config server host", "0.0.0.0")
        .option("-p, --port <port>", "config server port", 1996)
        .parse(process.argv);

    const app = Application.getInstance();
    app.host = program.host;
    app.port = Number(program.port);

    console.log(`host: ${app.host}, port: ${app.port}`);

    if (!initCore()) {
        process.exit(1);
    }

    if (!initApp()) {
        process.exit(1);
    }

    process.on("uncaughtException", (error: Error) => { });
    process.on("unhandledRejection", (reason: {} | null | undefined, promise: Promise<any>) => { });
    process.on("rejectionHandled", (promise: Promise<any>) => { })
}

main();