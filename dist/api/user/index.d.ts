import { MarkedMap } from "../../base/Common";
import { APIReturn } from "../Types";
declare function getAll(): Promise<APIReturn>;
declare function get(data: MarkedMap): Promise<APIReturn>;
declare function add(data: MarkedMap): Promise<APIReturn>;
declare function update(data: MarkedMap): Promise<APIReturn>;
declare function remove(data: MarkedMap): Promise<APIReturn>;
declare const _default: {
    getAll: typeof getAll;
    get: typeof get;
    add: typeof add;
    remove: typeof remove;
    update: typeof update;
};
export default _default;
