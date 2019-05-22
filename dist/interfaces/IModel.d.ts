import IProxy from "./IProxy";
import Class from "./IClass";
import { MaybeUndefined } from "../base/Common";
interface IModel {
    registerProxy(proxy: IProxy): void;
    removeProxy(proxyName: string): MaybeUndefined<IProxy>;
    retriveProxy<T extends IProxy>(proxyName: string, typeChecker: Class<T>): MaybeUndefined<T>;
    hasProxy(proxyName: string): boolean;
}
export default IModel;
