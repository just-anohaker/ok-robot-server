import Koa = require("koa");
import KoaRouter = require("koa-router");

import IHttp, { koaResponse } from "../http";
import Application from "../../../Application";

// /> 
import { apiUser } from "../../../../src";

class UserAPI implements IHttp {
    private _http?: Koa;

    constructor() { }

    get Name(): string {
        return "API_USER";
    }

    onBind(koa: Koa): void {
        this._http = koa;
    }

    onRouter(): void {
        const router = new KoaRouter();

        router.get("/api/user", this.getUser);
        router.get("/api/user/all", this.getAllUsers);
        router.post("/api/user", this.addUser);
        router.post("/api/user/update", this.updateUser);
        router.post("/api/user/remove", this.removeUser);

        this._http!.use(router.routes());
    }

    private getUser = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiUser.get(ctx.query || {}))
    }
    // {
    //     ctx.body = apiUser.get(ctx.query || {});

    //     const body = ctx.query;


    //     const validation = Schema.validateGetUser(body);
    //     if (validation !== undefined) {
    //         return koaFailure(ctx, validation);

    //     }

    //     this._checkUserProxy();
    //     const user = this._userProxy!.get(body.userId);
    //     return koaSuccess(ctx, user === undefined ? undefined : {
    //         id: user.id,
    //         groupName: user.groupName,
    //         name: user.name,
    //         apikey: user.apiKey,
    //         apiSecret: user.apiSecret
    //     });
    // }

    private getAllUsers = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiUser.getAll());
    }
    // {
    //     this._checkUserMediator();
    //     const allUsers = this._userMediator!.getAllUsers();
    //     return koaSuccess(ctx, allUsers.map(account => ({
    //         id: account.id!,
    //         groupName: account.groupName!,
    //         name: account.name,
    //         apiKey: account.apiKey,
    //         apiSecret: account.apiSecret
    //     })));
    // }

    private addUser = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiUser.add(ctx.body || {}));
    }
    // {
    //     const body = ctx.body;
    //     const validation = Schema.validateAddUser(body);
    //     if (validation !== undefined) {
    //         return koaFailure(ctx, validation);
    //     }

    //     this._checkUserProxy();
    //     const newUser = this._userProxy!.add(body.groupName, {
    //         name: body.name,
    //         apiKey: body.apiKey,
    //         apiSecret: body.apiSecret
    //     });
    //     if (newUser) {
    //         return koaSuccess(ctx, {
    //             id: newUser.id,
    //             groupName: newUser.groupName,
    //             name: newUser.name,
    //             apiKey: newUser.apiKey,
    //             apiSecret: newUser.apiSecret
    //         });
    //     }

    //     return koaFailure(ctx,
    //         `Maybe user with name(${body.name}) and group(${body.groupName}) exists`);
    // }

    private updateUser = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiUser.update(ctx.body || {}));
    }
    // {
    //     const body = ctx.body;
    //     const validation = Schema.validateUpdateUser(body);
    //     if (validation !== undefined) {
    //         return koaFailure(ctx, validation);
    //     }

    //     this._checkUserProxy();
    //     const updateUser = this._userProxy!.update(body.userId, {
    //         groupName: body.options.groupName,
    //         name: body.options.name,
    //         apiKey: body.options.apiKey,
    //         apiSecret: body.options.apiSecret
    //     });
    //     if (updateUser) {
    //         return koaSuccess(ctx, {
    //             id: updateUser.id,
    //             groupName: updateUser.groupName,
    //             name: updateUser.name,
    //             apiKey: updateUser.apiKey,
    //             apiSecret: updateUser.apiSecret
    //         });
    //     }

    //     return koaFailure(ctx,
    //         `Maybe user with userId(${body.userId}) not exists`);
    // }

    private removeUser = async (ctx: Koa.Context) => {
        koaResponse(ctx, await apiUser.remove(ctx.body || {}));
    }
    // {
    //     const body = ctx.body;
    //     const validation = Schema.validateRemoveUser(body);
    //     if (validation !== undefined) {
    //         return koaFailure(ctx, validation);
    //     }

    //     this._checkUserProxy();
    //     const removeUser = this._userProxy!.remove(body.userId);
    //     if (removeUser) {
    //         return koaSuccess(ctx, {
    //             id: removeUser.id,
    //             groupName: removeUser.groupName,
    //             name: removeUser.name,
    //             apiKey: removeUser.apiKey,
    //             apiSecret: removeUser.apiSecret
    //         });
    //     }

    //     return koaFailure(ctx,
    //         `Maybe user with userId(${body.userId}) not exists`);
    // }
}

Application.getInstance().registerHttp(new UserAPI());
