import { MarkedMap } from "../../base/Common";
import { APIReturn } from "../Types";
import { apiSuccess, apiFailure, ProxyHelper, MediatorHelper } from "../Utils";
import Schema from "./Schema";

async function init(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateInit(data);
    if (validation !== undefined) {
        return apiFailure(validation);
    }

    try {
        const resp = ProxyHelper.AutoMakerProxy.init(data.options, data.account);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function start(): Promise<APIReturn> {
    try {
        const success = ProxyHelper.AutoMakerProxy.start();
        return apiSuccess(success);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function stop(): Promise<APIReturn> {
    try {
        const success = ProxyHelper.AutoMakerProxy.stop();
        return apiSuccess(success);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function isrunning(): Promise<APIReturn> {
    try {
        const bIsRunning = ProxyHelper.AutoMakerProxy.isRunning();
        return apiSuccess(bIsRunning);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function optionAndAccount(): Promise<APIReturn> {
    try {
        const resp = ProxyHelper.AutoMakerProxy.OptionsAndAccount;
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