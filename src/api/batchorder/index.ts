import { MarkedMap } from "../../base/Common";
import { APIReturn } from "../Types";
import { apiSuccess, apiFailure, ProxyHelper } from "../Utils";
import Schema from "./Schema";

async function generate(data: MarkedMap): Promise<APIReturn> {
    // TODO: validate data
    ProxyHelper.BatchOrderProxy.generate(data.options, data.account);
    return apiSuccess(undefined);
}

async function start(data: MarkedMap): Promise<APIReturn> {
    const bResp = ProxyHelper.BatchOrderProxy.start(data.client_oids);
    return apiSuccess(bResp);
}

export default {
    generate,
    start
}