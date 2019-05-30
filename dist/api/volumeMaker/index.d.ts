import { APIReturn } from "../Types";
import { MarkedMap } from "../../base/Common";
declare function setAutoTradeOptions(options: MarkedMap, account: MarkedMap): Promise<APIReturn>;
declare function startAutoTrade(): Promise<APIReturn>;
declare function stopAutoTrade(): Promise<APIReturn>;
declare const _default: {
    setAutoTradeOptions: typeof setAutoTradeOptions;
    startAutoTrade: typeof startAutoTrade;
    stopAutoTrade: typeof stopAutoTrade;
};
export default _default;
