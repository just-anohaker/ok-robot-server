import { GenericType } from "../base/Common";
import { APIReturn } from "./Types";
import UserProxy from "../app/proxies/UserProxy";
import UserMediator from "../app/mediatores/UserMediator";
export declare function apiSuccess(result: GenericType): APIReturn;
export declare function apiFailure(error: string): APIReturn;
export declare class ProxyHelper {
    private static _userProxy;
    static readonly UserProxy: UserProxy;
}
export declare class MediatorHelper {
    private static _userMediator;
    static readonly UserMediator: UserMediator;
}
