import IProxy from "./IProxy";
import Class from "./IClass";

interface IModel {
    registerProxy(proxy: IProxy): void;

    removeProxy(proxyName: string): IProxy;

    retriveProxy<T extends IProxy>(proxyName: string, typeChecker: Class<T>): T;

    hasProxy(proxyName: string): boolean;
}

export default IModel;