import { MarkedMap } from "../../base/Common";
import { APIReturn } from "../Types";
import { apiSuccess, apiFailure, ProxyHelper } from "../Utils";
import Schema from "./Schema";

async function init(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateInit(data);
    if (validation !== undefined) {
        return apiFailure(validation);
    }

    try {
        const resp = ProxyHelper.AutoMarketProxy.init(data.options, data.account);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function start(): Promise<APIReturn> {
    try {
        const resp = ProxyHelper.AutoMarketProxy.start();
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function stop(): Promise<APIReturn> {
    try {
        const resp = ProxyHelper.AutoMarketProxy.stop();
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function isrunning(): Promise<APIReturn> {
    try {
        const bIsRunning = ProxyHelper.AutoMarketProxy.isRunning();
        return apiSuccess(bIsRunning);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function optionAndAccount(): Promise<APIReturn> {
    try {
        const resp = ProxyHelper.AutoMarketProxy.OptionsAndAccount;
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

export default {
    init,
    start,
    stop,
    isrunning,
    optionAndAccount
}