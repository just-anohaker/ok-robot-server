import { APIReturn } from "../Types";
import { apiSuccess, ProxyHelper } from "../Utils";
import { MarkedMap } from "../../base/Common";
import { OKExAutoTradeOptions, IOKexAccount } from "../../app/Types";

async function setAutoTradeOptions(options: MarkedMap, account: MarkedMap): Promise<APIReturn>{
    ProxyHelper.VolumeMakerProxy.setAutoTradeOptions(options as OKExAutoTradeOptions, account as IOKexAccount);

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