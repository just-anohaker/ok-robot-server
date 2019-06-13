import { MarkedMap } from "../../base/Common";
import { APIReturn } from "../Types";
import { apiSuccess, apiFailure, ProxyHelper } from "../Utils";
import Schema from "./Schema";
import { OkexTradeParameters, OkexCandlesParameters, OkexTickerParameters } from "../../app/Types";


async function getSpotTicker(data: MarkedMap): Promise<APIReturn> {
    try {
        const resp = await ProxyHelper.OkexUtilsProxy.getSpotTicker(data.options as OkexTickerParameters);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error);
    }
}

async function getSpotTrade(data: MarkedMap): Promise<APIReturn> {
    try {
        const resp = await ProxyHelper.OkexUtilsProxy.getSpotTrade(data.options as OkexTradeParameters);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error);
    }
}

async function getSpotCandles(data: MarkedMap): Promise<APIReturn> {
    try {
        const resp = await ProxyHelper.OkexUtilsProxy.getSpotCandles(data.options as OkexCandlesParameters);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error);
    }
}

export default {
    getSpotTicker,
    getSpotTrade,
    getSpotCandles
};