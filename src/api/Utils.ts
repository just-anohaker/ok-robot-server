import { GenericType, MaybeUndefined } from "../base/Common";
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
    // instances
    private static _userProxy: MaybeUndefined<UserProxy>;


    // getters
    static get UserProxy(): UserProxy {
        if (ProxyHelper._userProxy === undefined) {
            ProxyHelper._userProxy = Facade.getInstance().retrieveProxy(
                UserProxy.name,
                UserProxy
            );
        }

        return ProxyHelper._userProxy!;
    }
}

export class MediatorHelper {
    // instances
    private static _userMediator: MaybeUndefined<UserMediator>;

    // getters
    static get UserMediator(): UserMediator {
        if (MediatorHelper._userMediator === undefined) {
            MediatorHelper._userMediator = Facade.getInstance().retrieveMediator(
                UserMediator.NAME,
                UserMediator
            );
        }
        return MediatorHelper._userMediator!;
    }
}