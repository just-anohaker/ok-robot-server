import { GenericType } from "../base/Common";
import { APIReturn } from "./Types";

import Facade from "../patterns/facade/Facade";
// proxies
import UserProxy from "../app/proxies/UserProxy";
// import VolumeMakerProxy from "../app/proxies/VolumeMaker";
import AutoMakerProxy from "../app/proxies/AutoMakerProxy";
import AutoMarketProxy from "../app/proxies/AutoMarketProxy";
import BatchOrderProxy from "../app/proxies/BatchOrderProxy";
import TakeOrderProxy from "../app/proxies/TakeOrderProxy";
import OkexUtilsProxy from "../app/proxies/OkexUtilsProxy";
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

    // static get VolumeMakerProxy(): VolumeMakerProxy {
    //     return Facade.getInstance().retrieveProxy(VolumeMakerProxy.NAME, VolumeMakerProxy);
    // }

    static get AutoMakerProxy(): AutoMakerProxy {
        return Facade.getInstance().retrieveProxy(AutoMakerProxy.NAME, AutoMakerProxy);
    }

    static get AutoMarketProxy(): AutoMarketProxy {
        return Facade.getInstance().retrieveProxy(AutoMarketProxy.NAME, AutoMarketProxy);
    }

    static get BatchOrderProxy(): BatchOrderProxy {
        return Facade.getInstance().retrieveProxy(BatchOrderProxy.NAME, BatchOrderProxy);
    }

    static get TakeOrderProxy(): TakeOrderProxy {
        return Facade.getInstance().retrieveProxy(TakeOrderProxy.NAME, TakeOrderProxy);
    }

    static get OkexUtilsProxy(): OkexUtilsProxy {
        return Facade.getInstance().retrieveProxy(OkexUtilsProxy.NAME, OkexUtilsProxy);
    }
}

export class MediatorHelper {
    // getters
    static get UserMediator(): UserMediator {
        return Facade.getInstance().retrieveMediator(UserMediator.NAME, UserMediator)!;
    }
}