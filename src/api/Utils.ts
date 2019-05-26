import { GenericType } from "../base/Common";
import { APIReturn } from "./Types";

import Facade from "../patterns/facade/Facade";
// proxies
import UserProxy from "../app/proxies/UserProxy";
// mediators
import UserMediator from "../app/mediatores/UserMediator";

export function apiSuccess(result: GenericType): APIReturn {
    return {
        success: true,
        result
    };
}

export function apiFailure(error: string): APIReturn {
    return {
        success: false,
        error
    };
}

export class ProxyHelper {
    // getters
    static get UserProxy(): UserProxy {
        return Facade.getInstance().retrieveProxy(UserProxy.NAME, UserProxy)!;
    }
}

export class MediatorHelper {
    // getters
    static get UserMediator(): UserMediator {
        return Facade.getInstance().retrieveMediator(UserMediator.NAME, UserMediator)!;
    }
}