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
        const resp = await ProxyHelper.BatchOrderProxy.startDepInfo(data.account);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function stopDepInfo(): Promise<APIReturn> {
    try {
        const resp = await ProxyHelper.BatchOrderProxy.stopDepInfo();
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

export default {
    generate,
    cancel,
    limitOrder,
    marketOrder,
    startDepInfo,
    stopDepInfo,
    getOrderData
}