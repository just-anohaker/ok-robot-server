import { MarkedMap } from "../../base/Common";
import { APIReturn } from "../Types";
import { apiSuccess, apiFailure, ProxyHelper } from "../Utils";
import Schema from "./Schema";

async function generate(data: MarkedMap): Promise<APIReturn> {
    // TODO: validate data
    ProxyHelper.TakeOrderProxy.generate(data.options, data.account);
    return apiSuccess(undefined);
}

async function start(data: MarkedMap): Promise<APIReturn> {
    const bResp = ProxyHelper.TakeOrderProxy.start(data.client_oids);
    return apiSuccess(bResp);
}

export default {
    generate,
    start
}