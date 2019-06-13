import { MarkedMap } from "../../base/Common";
import { APIReturn } from "../Types";
declare function monitSpotTrade(data: MarkedMap): Promise<APIReturn>;
declare function unmonitSpotTrade(data: MarkedMap): Promise<APIReturn>;
declare function monitSpotTicker(data: MarkedMap): Promise<APIReturn>;
declare function unmonitSpotTicker(data: MarkedMap): Promise<APIReturn>;
declare const _default: {
    monitSpotTrade: typeof monitSpotTrade;
    unmonitSpotTrade: typeof unmonitSpotTrade;
    monitSpotTicker: typeof monitSpotTicker;
    unmonitSpotTicker: typeof unmonitSpotTicker;
};
export default _default;
