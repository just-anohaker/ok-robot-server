import { MarkedMap } from "../../base/Common";
import { APIReturn } from "../Types";
import { apiSuccess, apiFailure, ProxyHelper, MediatorHelper } from "../Utils";
import Schema from "./Schema";

async function init(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateInit(data);
    if (validation !== undefined) {
        return apiFailure(validation);
    }

    ProxyHelper.AutoMakerProxy.init(data.options, data.account);
    return apiSuccess(undefined);
}

async function start(): Promise<APIReturn> {
    const success = ProxyHelper.AutoMakerProxy.start();
    return apiSuccess(success);
}

async function stop(): Promise<APIReturn> {
    const success = ProxyHelper.AutoMakerProxy.stop();
    return apiSuccess(success);
}

async function isrunning(): Promise<APIReturn> {
    const bIsRunning = ProxyHelper.AutoMakerProxy.isRunning();
    return apiSuccess(bIsRunning);
}

async function optionAndAccount(): Promise<APIReturn> {
    const resp = ProxyHelper.AutoMakerProxy.OptionsAndAccount;
    return apiSuccess(resp);
}

export default {
    init,
    start,
    stop,
    isrunning,
    optionAndAccount
}