import { MarkedMap } from "../../base/Common";
import { APIReturn } from "../Types";
declare function generate(data: MarkedMap): Promise<APIReturn>;
declare function cancel(data: MarkedMap): Promise<APIReturn>;
declare function limitOrder(data: MarkedMap): Promise<APIReturn>;
declare function marketOrder(data: MarkedMap): Promise<APIReturn>;
declare function startDepInfo(data: MarkedMap): Promise<APIReturn>;
declare function stopDepInfo(data: MarkedMap): Promise<APIReturn>;
declare function getOrderData(data: MarkedMap): Promise<APIReturn>;
declare const _default: {
    generate: typeof generate;
    cancel: typeof cancel;
    limitOrder: typeof limitOrder;
    marketOrder: typeof marketOrder;
    startDepInfo: typeof startDepInfo;
    stopDepInfo: typeof stopDepInfo;
    getOrderData: typeof getOrderData;
};
export default _default;
