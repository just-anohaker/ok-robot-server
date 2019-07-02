import { MarkedMap } from "../../base/Common";
import { APIReturn } from "../Types";
declare function init(data: MarkedMap): Promise<APIReturn>;
declare function start(): Promise<APIReturn>;
declare function stop(): Promise<APIReturn>;
declare function isrunning(): Promise<APIReturn>;
declare function optionAndAccount(): Promise<APIReturn>;
declare function getOrderInfo(data: MarkedMap): Promise<APIReturn>;
declare const _default: {
    init: typeof init;
    start: typeof start;
    stop: typeof stop;
    isrunning: typeof isrunning;
    optionAndAccount: typeof optionAndAccount;
    getOrderInfo: typeof getOrderInfo;
};
export default _default;
