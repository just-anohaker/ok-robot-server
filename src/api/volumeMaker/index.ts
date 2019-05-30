import { APIReturn } from "../Types";
import { apiSuccess, ProxyHelper } from "../Utils";
import { MarkedMap } from "../../base/Common";
import { OKExAutoTradeOptions, IOKexAccount } from "../../app/Types";

async function setAutoTradeOptions(data: MarkedMap): Promise<APIReturn>{
    ProxyHelper.VolumeMakerProxy.setAutoTradeOptions(data.options as OKExAutoTradeOptions, data.account as IOKexAccount);

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