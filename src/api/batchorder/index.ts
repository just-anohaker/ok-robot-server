import { MarkedMap } from "../../base/Common";
import { APIReturn } from "../Types";
import { apiSuccess, apiFailure, ProxyHelper } from "../Utils";
import Schema from "./Schema";

async function generate(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateGenerate(data);
    if (validation !== undefined) {
        return apiFailure(validation);
    }

    const resp = ProxyHelper.BatchOrderProxy.generate(data.options, data.account);
    return apiSuccess(resp);
}

async function start(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateStart(data);
    if (validation !== undefined) {
        return apiFailure(validation);
    }

    const resp = ProxyHelper.BatchOrderProxy.start(data.client_oids);
    return apiSuccess(resp);
}

async function cancel(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateCancel(data);
    if (validation !== undefined) {
        return apiFailure(validation);
    }

    const resp = ProxyHelper.BatchOrderProxy.cancel(data.options, data.account);
    return apiSuccess(resp);
}

export default {
    generate,
    start,
    cancel
}