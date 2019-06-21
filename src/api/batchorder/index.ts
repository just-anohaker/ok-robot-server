import { MarkedMap } from "../../base/Common";
import { APIReturn } from "../Types";
import { apiSuccess, apiFailure, ProxyHelper } from "../Utils";
import Schema from "./Schema";

async function generate(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateGenerate(data);
    if (validation !== undefined) {
        return apiFailure(validation);
    }

    try {
        const resp = await ProxyHelper.BatchOrderProxy.generate(data.options, data.account);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function toBatchOrder(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateGenerate(data);
    if (validation !== undefined) {
        return apiFailure(validation);
    }

    try {
        const resp = await ProxyHelper.BatchOrderProxy.toBatchOrder(data.options, data.account);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}
// async function start(data: MarkedMap): Promise<APIReturn> {
//     const validation = Schema.validateStart(data);
//     if (validation !== undefined) {
//         return apiFailure(validation);
//     }

//     const resp =await ProxyHelper.BatchOrderProxy.start(data.client_oids);
//     return apiSuccess(resp);
// }

async function cancel(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateCancel(data);
    if (validation !== undefined) {
        return apiFailure(validation);
    }

    try {
        const resp = await ProxyHelper.BatchOrderProxy.cancel(data.options, data.account);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function limitOrder(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateCancel(data);
    if (validation !== undefined) {
        return apiFailure(validation);
    }

    try {
        const resp = await ProxyHelper.BatchOrderProxy.limitOrder(data.options, data.account);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function marketOrder(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateCancel(data);
    if (validation !== undefined) {
        return apiFailure(validation);
    }

    try {
        const resp = await ProxyHelper.BatchOrderProxy.marketOrder(data.options, data.account);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function startDepInfo(data: MarkedMap): Promise<APIReturn> {
    // const validation = Schema.validateCancel(data);
    // if (validation !== undefined) {
    //     return apiFailure(validation);
    // }
    try {
        const resp = await ProxyHelper.BatchOrderProxy.startDepInfo(data.options);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function stopDepInfo(data: MarkedMap): Promise<APIReturn> {
    // const validation = Schema.validateCancel(data);
    // if (validation !== undefined) {
    //     return apiFailure(validation);
    // }

    try {
        const resp = await ProxyHelper.BatchOrderProxy.stopDepInfo(data.options);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function pageKline(data: MarkedMap): Promise<APIReturn> {
    try {
        const resp = await ProxyHelper.BatchOrderProxy.pageKline(data.options);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function pageInfo(data: MarkedMap): Promise<APIReturn> {
    try {
        const resp = await ProxyHelper.BatchOrderProxy.pageInfo(data.options);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}
async function getOrderData(data: MarkedMap): Promise<APIReturn> {
    // const validation = Schema.validateCancel(data);
    // if (validation !== undefined) {
    //     return apiFailure(validation);
    // }

    try {
        const resp = await ProxyHelper.BatchOrderProxy.getOrderData(data.options, data.account);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}
async function getTradeData(data: MarkedMap): Promise<APIReturn> {
    try {
        const resp = await ProxyHelper.BatchOrderProxy.getTradeData(data.options);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function getCandlesData(data: MarkedMap): Promise<APIReturn> {
    try {
        const resp = await ProxyHelper.BatchOrderProxy.getCandlesData(data.options);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

export default {
    generate,
    toBatchOrder,
    cancel,
    limitOrder,
    marketOrder,
    startDepInfo,
    stopDepInfo,
    getOrderData,
    pageInfo,
    pageKline,
    getTradeData,
    getCandlesData
}