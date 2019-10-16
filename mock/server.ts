import program = require("commander");
import Koa = require("koa");
// import KoaBodyParser = require("koa-bodyparser")
// import KoaCors = require("@koa/cors");
const Cors = require('koa2-cors');

import SocketIO = require("socket.io");
import { Server } from "http";
import * as ParsedPath from "path";
import uuid from "uuid";
const router = require('koa-router')();
const koaBody = require('koa-body');
const fs = require('fs');
// import { send } from 'koa-send';
const send = require('koa-send');
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
    OkexUtilsProxy,
    OkexMonitProxy
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
    facadeInst.registerProxy(new OkexMonitProxy());

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
    koa.use(Cors({
        // origin: function(ctx) {
        //     if (ctx.url === 'api') {
        //         return '*';
        //     }
        //     return 'http://localhost:8030';
        // },
        origin: '*',
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
        maxAge: 5,
        credentials: true,
        allowMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept',"X-Requested-With","Origin"]
    }))
    // koa.use(KoaBodyParser( {
    //     formLimit:"10mb",
    //     jsonLimit:"10mb",
    //     textLimit:"10mb"
    // }));
    koa.use(  koaBody({
        multipart: true,
        formidable: {
            maxFileSize: 1000*1024*1024   // 设置上传文件大小最大限制，默认10M
        }
    }));
    router.post('/upload',
    
    async (ctx)=>{

        const file = ctx.request.files.file;
        const reader = fs.createReadStream(file.path);
        const ownDirName = ".etm_okex_datas";
        const filePath = ParsedPath.resolve(ParsedPath.join(process.cwd(), ownDirName,"upload"));
        const ext = file.name.split('.').pop();   
        let fname= uuid.v1()+"."+ext;
        let fileResource =ParsedPath.join(filePath, fname)// __dirname + "/static/upload/";
        ctx.set("Content-disposition", "attachment; filename=" +fname)
        // let fileResource = filePath + `/${file.name}`;
        if (!fs.existsSync(filePath)) {  //判断staic/upload文件夹是否存在，如果不存在就新建一个
            fs.mkdir(filePath, (err) => {
                if (err) {
                    ctx.response.body =  {
                        success: false,
                        error:err+""
                    }
                    throw new Error(err)
                } else {
                    let upstream = fs.createWriteStream(fileResource);
                    reader.pipe(upstream);
                    ctx.response.body =  {
                        success: true,
                        result:{
                            filename: `${fname}` 
                        }
                    }
                }
            })
        } else {
            let upstream = fs.createWriteStream(fileResource)
            reader.pipe(upstream);
            ctx.response.body =  {
                success: true,
                result:{
                    filename: `${fname}` 
                }
            }
        }
    }
    );
    router.get('/download/:name', async (ctx)=>{
        const name = ctx.params.name;
        const ownDirName = ".etm_okex_datas";
        const filePath = ParsedPath.resolve(ParsedPath.join(process.cwd(), ownDirName,"upload"));
        let file =ParsedPath.join(filePath, name)
        // const path = `upload/${name}`;
        ctx.set("Content-disposition", "attachment; filename=" +name)
        ctx.attachment(file);
        await send(ctx,  name ,{ root: filePath });
    })
    koa.use(router.routes());
    koa.use(router.allowedMethods());
    koa.use(async (ctx, next) => {
        // Logger
        console.log(`[HTTP] ${ctx.method}: ${ctx.path}`);

        await next();
    });

    koa.use(async (ctx, next) => {
        ctx.body = ctx.request.body;
        ctx.set("Access-Control-Allow-Origin", "*");
        ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
        ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
        if (ctx.method == 'OPTIONS') {
            ctx.body = 200; 
          } else {
            await next();
          }
    });


  
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