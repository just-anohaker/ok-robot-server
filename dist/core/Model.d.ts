import IModel from "../interfaces/IModel";
import IProxy from "../interfaces/IProxy";
import Class from "../interfaces/IClass";
import { MaybeUndefined } from "../base/Common";
declare class Model implements IModel {
    private static _instance;
    static getInstance(): IModel;
    private _proxies;
    private constructor();
    private initializeModel;
    registerProxy(proxy: IProxy): void;
    removeProxy(proxyName: string): MaybeUndefined<IProxy>;
    retriveProxy<T extends IProxy>(proxyName: string, cls: Class<T>): MaybeUndefined<T>;
    hasProxy(proxyName: string): boolean;
}
export default Model;
