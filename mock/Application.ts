import Koa = require("koa");
import SocketIO = require("socket.io");

import { IFacade } from "../src";
import { IHttp, ISockerIO } from "./api/http/http";

class Application {
    private static _instance: Application;

    static getInstance(): Application {
        if (Application._instance === undefined) {
            Application._instance = new Application();
        }

        return Application._instance;
    }

    private _host?: string;
    private _port?: number;
    private _http?: Koa;
    private _io?: SocketIO.Server;
    private _facade?: IFacade;
    private _httpOperators: IHttp[];
    private _socketIOOperators: ISockerIO[];

    private constructor() {
        this._httpOperators = [];
        this._socketIOOperators = [];
    }

    set host(val: string) {
        this._host = val;
    }

    get host(): string {
        return this._host!;
    }

    set port(val: number) {
        this._port = val;
    }

    get port(): number {
        return this._port!;
    }

    set http(val: Koa) {
        this._http = val;
    }

    get http(): Koa {
        return this._http!;
    }

    set io(val: SocketIO.Server) {
        this._io = val;
    }

    get io(): SocketIO.Server {
        return this._io!;
    }

    set facade(val: IFacade) {
        this._facade = val;
    }

    get facade(): IFacade {
        return this._facade!;
    }

    registerHttp(http: IHttp): void {
        console.log(`registerHttp ${http.Name}`);
        if (this._httpOperators.some(value => value.Name === http.Name)) {
            return;
        }

        this._httpOperators.push(http);
    }

    registerSocketIO(socketIO: ISockerIO): void {
        console.log(`registerIO ${socketIO.Name}`);
        if (this._socketIOOperators.some(value => value.Name === socketIO.Name)) {
            return;
        }

        this._socketIOOperators.push(socketIO);
    }

    initHttps(): boolean {
        this._httpOperators.forEach(op => {
            op.onBind(this._http!);
            op.onRouter();
        });
        return true;
    }

    initSocketIOs(): boolean {
        this._socketIOOperators.forEach(op => {
            op.onBindIO(this._io!);
        })
        return true;
    }
}

export default Application;