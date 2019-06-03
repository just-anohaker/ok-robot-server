import { MarkedMap } from "../../base/Common";
import { APIReturn } from "../Types";
import { apiSuccess, apiFailure, ProxyHelper } from "../Utils";
import Schema from "./Schema";

async function init(data: MarkedMap): Promise<APIReturn> {
    // TODO: validate data
    ProxyHelper.AutoMarketProxy.init(data.options, data.account);
    return apiSuccess(undefined);
}

async function start(): Promise<APIReturn> {
    ProxyHelper.AutoMarketProxy.start();
    // TODO: handle start return
    return apiSuccess(undefined);
}

async function stop(): Promise<APIReturn> {
    ProxyHelper.AutoMarketProxy.stop();
    // TODO: handle stop return
    return apiSuccess(undefined);
}

async function isrunning(): Promise<APIReturn> {
    const bIsRunning = ProxyHelper.AutoMarketProxy.isRunning();
    return apiSuccess({ running: bIsRunning });
}

async function optionAndAccount(): Promise<APIReturn> {
    const resp = ProxyHelper.AutoMarketProxy.OptionsAndAccount;
    // handler resp is undefined;
    return apiSuccess(resp);
}

export default {
    init,
    start,
    stop,
    isrunning,
    optionAndAccount
}