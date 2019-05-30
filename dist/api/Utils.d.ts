import { GenericType } from "../base/Common";
import { APIReturn } from "./Types";
import UserProxy from "../app/proxies/UserProxy";
import VolumeMakerProxy from "../app/proxies/VolumeMaker";
import UserMediator from "../app/mediatores/UserMediator";
export declare function apiSuccess(result: GenericType): APIReturn;
export declare function apiFailure(error: string): APIReturn;
export declare class ProxyHelper {
    static readonly UserProxy: UserProxy;
    static readonly VolumeMakerProxy: VolumeMakerProxy;
}
export declare class MediatorHelper {
    static readonly UserMediator: UserMediator;
}
