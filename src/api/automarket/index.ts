import { MarkedMap } from "../../base/Common";
import { APIReturn } from "../Types";
import { apiSuccess, apiFailure, ProxyHelper } from "../Utils";
import Schema from "./Schema";

async function init(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateInit(data);
    if (validation !== undefined) {
        return apiFailure(validation);
    }

    const resp = ProxyHelper.AutoMarketProxy.init(data.options, data.account);
    return apiSuccess(resp);
}

async function start(): Promise<APIReturn> {
    const resp = ProxyHelper.AutoMarketProxy.start();
    return apiSuccess(resp);
}

async function stop(): Promise<APIReturn> {
    const resp = ProxyHelper.AutoMarketProxy.stop();
    return apiSuccess(resp);
}

async function isrunning(): Promise<APIReturn> {
    const bIsRunning = ProxyHelper.AutoMarketProxy.isRunning();
    return apiSuccess({ running: bIsRunning });
}

async function optionAndAccount(): Promise<APIReturn> {
    const resp = ProxyHelper.AutoMarketProxy.OptionsAndAccount;
    return apiSuccess(resp);
}

export default {
    init,
    start,
    stop,
    isrunning,
    optionAndAccount
}