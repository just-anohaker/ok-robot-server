import IProxy from "./IProxy";
import Class from "./IClass";
import IMediator from "./IMediator";
import INotifier from "./INotifier";
import IObserver from "./IObserver";
import INotification from "./INotification";

interface IFacade extends INotifier {
    registerProxy(proxy: IProxy): void;

    removeProxy(proxyName: string): IProxy;

    retrieveProxy<T extends IProxy>(proxyName: string, cls: Class<T>): T;

    hasProxy(proxyName: string): boolean;

    registerMediator(mediator: IMediator): void;

    removeMediator(mediatorName: string): IMediator;

    retrieveMediator<T extends IMediator>(mediatorName: string, cls: Class<T>): T;

    hasMediator(mediatorName: string): boolean;

    registerObserver(notificationName: string, observer: IObserver): void;

    removeObserver(notificationName: string, notifyContext: any): void;

    notifyObservers(notification: INotification): void;
}

export default IFacade;