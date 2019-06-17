import { MarkedMap } from "../../base/Common";
import { APIReturn } from "../Types";
declare function monitSpotTrade(data: MarkedMap): Promise<APIReturn>;
declare function unmonitSpotTrade(data: MarkedMap): Promise<APIReturn>;
declare function monitSpotTicker(data: MarkedMap): Promise<APIReturn>;
declare function unmonitSpotTicker(data: MarkedMap): Promise<APIReturn>;
declare function monitSpotChannel(data: MarkedMap): Promise<APIReturn>;
declare function unmonitSpotChannel(data: MarkedMap): Promise<APIReturn>;
declare function monitSpotDepth(data: MarkedMap): Promise<APIReturn>;
declare function unmonitSpotDepth(data: MarkedMap): Promise<APIReturn>;
declare const _default: {
    monitSpotTrade: typeof monitSpotTrade;
    unmonitSpotTrade: typeof unmonitSpotTrade;
    monitSpotTicker: typeof monitSpotTicker;
    unmonitSpotTicker: typeof unmonitSpotTicker;
    monitSpotChannel: typeof monitSpotChannel;
    unmonitSpotChannel: typeof unmonitSpotChannel;
    monitSpotDepth: typeof monitSpotDepth;
    unmonitSpotDepth: typeof unmonitSpotDepth;
};
export default _default;
