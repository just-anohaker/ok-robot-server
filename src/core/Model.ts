import IModel from "../interfaces/IModel";
import IProxy from "../interfaces/IProxy";
import Class from "../interfaces/IClass";
import { MaybeUndefined } from "../base/Common";

class Model implements IModel {
    private static _instance: IModel;

    static getInstance(): IModel {
        if (Model._instance === undefined) {
            Model._instance = new Model();
        }

        return Model._instance;
    }

    private _proxies: Map<string, IProxy>;

    private constructor() {
        this._proxies = new Map<string, IProxy>();

        this.initializeModel();
    }

    private initializeModel(): void {

    }

    registerProxy(proxy: IProxy): void {
        if (this.hasProxy(proxy.proxyName)) {
            // TODO: proxy is exists;
            return;
        }

        this._proxies.set(proxy.proxyName, proxy);
        proxy.onRegister();
    }

    removeProxy(proxyName: string): MaybeUndefined<IProxy> {
        if (!this.hasProxy(proxyName)) {
            return undefined;
        }

        const proxyInst = this._proxies.get(proxyName)!;
        this._proxies.delete(proxyName);
        proxyInst.onRemove();
        return proxyInst;
    }

    retriveProxy<T extends IProxy>(proxyName: string, cls: Class<T>): MaybeUndefined<T> {
        if (!this.hasProxy(proxyName)) {
            return undefined;
        }

        const proxyInst = this._proxies.get(proxyName)!;
        if (proxyInst instanceof cls) {
            return proxyInst as T;
        }

        return undefined;
    }

    hasProxy(proxyName: string): boolean {
        return this._proxies.has(proxyName);
    }
}

export default Model;