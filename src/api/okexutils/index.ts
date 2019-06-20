import { MarkedMap } from "../../base/Common";
import { APIReturn } from "../Types";
import { apiSuccess, apiFailure, ProxyHelper } from "../Utils";
import Schema from "./Schema";
import { OkexTradeParameters, OkexCandlesParameters, OkexTickerParameters } from "../../app/Types";


async function getSpotTicker(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateGetSpotTicker(data);
    if (validation) {
        return apiFailure(validation);
    }

    try {
        const resp = await ProxyHelper.OkexUtilsProxy.getSpotTicker(data as OkexTickerParameters);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function getSpotTrade(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateGetSpotTrade(data);
    if (validation) {
        return apiFailure(validation);
    }

    try {
        const resp = await ProxyHelper.OkexUtilsProxy.getSpotTrade(data as OkexTradeParameters);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function getSpotCandles(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateGetSpotCandles(data);
    if (validation) {
        return apiFailure(validation);
    }

    try {
        const resp = await ProxyHelper.OkexUtilsProxy.getSpotCandles(data as OkexCandlesParameters);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function getWallet(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateGetWallet(data);
    if (validation) {
        return apiFailure(validation);
    }

    try {
        const resp = await ProxyHelper.OkexUtilsProxy.getWallet(data.account, data.currencies);
        return apiSuccess(resp);
    } catch (error) {
        apiFailure(error.toString());
    }
}

async function getWalletList(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateGetWalletList(data);
    if (validation) {
        return apiFailure(validation);
    }

    try {
        const resp = await ProxyHelper.OkexUtilsProxy.getWalletList(data.account);
        return apiSuccess(resp);
    } catch (error) {
        apiFailure(error.toString());
    }
}

export default {
    getSpotTicker,
    getSpotTrade,
    getSpotCandles,
    getWallet,
    getWalletList
};