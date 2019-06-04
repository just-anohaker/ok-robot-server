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
    ProxyHelper.AutoMakerProxy.start();
    // TODO: handle start return
    return apiSuccess(undefined);
}

async function stop(): Promise<APIReturn> {
    ProxyHelper.AutoMakerProxy.stop();
    // TODO: handle stop return
    return apiSuccess(undefined);
}

async function isrunning(): Promise<APIReturn> {
    const bIsRunning = ProxyHelper.AutoMakerProxy.isRunning();
    return apiSuccess({ running: bIsRunning });
}

async function optionAndAccount(): Promise<APIReturn> {
    const resp = ProxyHelper.AutoMakerProxy.OptionsAndAccount;
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