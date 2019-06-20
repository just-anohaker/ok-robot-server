import { MarkedMap } from "../../base/Common";
import { APIReturn } from "../Types";
declare function getSpotTicker(data: MarkedMap): Promise<APIReturn>;
declare function getSpotTrade(data: MarkedMap): Promise<APIReturn>;
declare function getSpotCandles(data: MarkedMap): Promise<APIReturn>;
declare function getWallet(data: MarkedMap): Promise<APIReturn>;
declare function getWalletList(data: MarkedMap): Promise<APIReturn>;
declare const _default: {
    getSpotTicker: typeof getSpotTicker;
    getSpotTrade: typeof getSpotTrade;
    getSpotCandles: typeof getSpotCandles;
    getWallet: typeof getWallet;
    getWalletList: typeof getWalletList;
};
export default _default;
