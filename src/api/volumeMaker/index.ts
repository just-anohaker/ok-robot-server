import { APIReturn } from "../Types";
import { apiSuccess, apiFailure, ProxyHelper } from "../Utils";
import { MarkedMap } from "../../base/Common";
import { OKExAutoTradeOptions, IOKexAccount } from "../../app/Types";

import Schema from "./Schema";

async function setAutoTradeOptions(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateSetOptions(data);
    if (validation !== undefined) {
        return apiFailure(validation);
    }
    ProxyHelper.VolumeMakerProxy
        .setAutoTradeOptions(
            data.options as OKExAutoTradeOptions,
            data.account as IOKexAccount
        );

    return apiSuccess(undefined);
}

async function startAutoTrade(): Promise<APIReturn> {
    ProxyHelper.VolumeMakerProxy.startAutoTrade();
    return apiSuccess(undefined);
}

async function stopAutoTrade(): Promise<APIReturn> {
    ProxyHelper.VolumeMakerProxy.stopAutoTrade();
    return apiSuccess(undefined);
}

export default {
    setAutoTradeOptions,
    startAutoTrade,
    stopAutoTrade
}