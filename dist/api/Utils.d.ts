import { GenericType } from "../base/Common";
import { APIReturn } from "./Types";
import UserProxy from "../app/proxies/UserProxy";
import AutoMakerProxy from "../app/proxies/AutoMakerProxy";
import AutoMarketProxy from "../app/proxies/AutoMarketProxy";
import BatchOrderProxy from "../app/proxies/BatchOrderProxy";
import TakeOrderProxy from "../app/proxies/TakeOrderProxy";
import UserMediator from "../app/mediatores/UserMediator";
export declare function apiSuccess(result: GenericType): APIReturn;
export declare function apiFailure(error: string): APIReturn;
export declare class ProxyHelper {
    static readonly UserProxy: UserProxy;
    static readonly AutoMakerProxy: AutoMakerProxy;
    static readonly AutoMarketProxy: AutoMarketProxy;
    static readonly BatchOrderProxy: BatchOrderProxy;
    static readonly TakeOrderProxy: TakeOrderProxy;
}
export declare class MediatorHelper {
    static readonly UserMediator: UserMediator;
}
