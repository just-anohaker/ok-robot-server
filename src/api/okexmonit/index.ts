import { MarkedMap } from "../../base/Common";
import { APIReturn } from "../Types";
import { apiSuccess, apiFailure, ProxyHelper } from "../Utils";
import Schema from "./Schema";

async function monitSpotTrade(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateMonitSpotTrade(data);
    if (validation) {
        return apiFailure(validation);
    }

    try {
        const resp = ProxyHelper.OkexMonitProxy.monitSpotTrade(data.instrument_id);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function unmonitSpotTrade(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateUnmonitSpotTrade(data);
    if (validation) {
        return apiFailure(validation);
    }

    try {
        const resp = ProxyHelper.OkexMonitProxy.unmonitSpotTrade(data.instrument_id);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function monitSpotTicker(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateMonitSpotTicker(data);
    if (validation) {
        return apiFailure(validation);
    }

    try {
        const resp = ProxyHelper.OkexMonitProxy.monitSpotTicker(data.instrument_id);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function unmonitSpotTicker(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateUnmonitSpotTicker(data);
    if (validation) {
        return apiFailure(validation);
    }

    try {
        const resp = ProxyHelper.OkexMonitProxy.unmonitSpotTicker(data.instrument_id);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function monitSpotChannel(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateMonitSpotChannel(data);
    if (validation) {
        return apiFailure(validation);
    }

    try {
        const resp = ProxyHelper.OkexMonitProxy.monitSpotChannel(data.channel_name, data.filter);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function unmonitSpotChannel(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateUnmonitSpotChannel(data);
    if (validation) {
        return apiFailure(validation);
    }

    try {
        const resp = ProxyHelper.OkexMonitProxy.unmonitSpotChannel(data.channel_name, data.filter);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function monitSpotDepth(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateMonitSpotDepth(data);
    if (validation) {
        return apiFailure(validation);
    }

    try {
        const resp = await ProxyHelper.OkexMonitProxy.monitDepth(data.account, data.instrument_id);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function unmonitSpotDepth(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateUnmonitSpotDepth(data);
    if (validation) {
        return apiFailure(validation);
    }

    try {
        const resp = await ProxyHelper.OkexMonitProxy.unmonitDepth(data.account, data.instrument_id);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

export default {
    monitSpotTrade,
    unmonitSpotTrade,
    monitSpotTicker,
    unmonitSpotTicker,
    monitSpotChannel,
    unmonitSpotChannel,
    monitSpotDepth,
    unmonitSpotDepth
};



