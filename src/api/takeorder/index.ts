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
        const resp = ProxyHelper.TakeOrderProxy.generate(data.options, data.account);
        return apiSuccess(resp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

async function start(data: MarkedMap): Promise<APIReturn> {
    const validation = Schema.validateStart(data);
    if (validation !== undefined) {
        return apiFailure(validation);
    }

    try {
        const bResp = ProxyHelper.TakeOrderProxy.start(data.client_oids);
        return apiSuccess(bResp);
    } catch (error) {
        return apiFailure(error.toString());
    }
}

export default {
    generate,
    start
}