import IProxy from "./IProxy";
import Class from "./IClass";
import IMediator from "./IMediator";
import INotifier from "./INotifier";
import IObserver from "./IObserver";
import INotification from "./INotification";
import { MaybeUndefined } from "../base/Common";
interface IFacade extends INotifier {
    registerProxy(proxy: IProxy): void;
    removeProxy(proxyName: string): MaybeUndefined<IProxy>;
    retrieveProxy<T extends IProxy>(proxyName: string, cls: Class<T>): MaybeUndefined<T>;
    hasProxy(proxyName: string): boolean;
    registerMediator(mediator: IMediator): void;
    removeMediator(mediatorName: string): MaybeUndefined<IMediator>;
    retrieveMediator<T extends IMediator>(mediatorName: string, cls: Class<T>): MaybeUndefined<T>;
    hasMediator(mediatorName: string): boolean;
    registerObserver(notificationName: string, observer: IObserver): void;
    removeObserver(notificationName: string, notifyContext: any): void;
    notifyObservers(notification: INotification): void;
}
export default IFacade;
