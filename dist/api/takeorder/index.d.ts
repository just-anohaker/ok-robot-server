import { MarkedMap } from "../../base/Common";
import { APIReturn } from "../Types";
declare function generate(data: MarkedMap): Promise<APIReturn>;
declare function start(data: MarkedMap): Promise<APIReturn>;
declare const _default: {
    generate: typeof generate;
    start: typeof start;
};
export default _default;
