import IFacade from "../../interfaces/IFacade";
import IModel from "../../interfaces/IModel";
import IController from "../../interfaces/IController";
import Model from "../../core/Model";
import Controller from "../../core/Controller";
import IProxy from "../../interfaces/IProxy";
import Class from "../../interfaces/IClass";
import IMediator from "../../interfaces/IMediator";
import IObserver from "../../interfaces/IObserver";
import INotification from "../../interfaces/INotification";
import Notification from "../../patterns/observer/Notification";
import { MaybeUndefined } from "../../base/Common";

class Facade implements IFacade {
    private static _instance: IFacade;

    static getInstance(): IFacade {
        if (Facade._instance === undefined) {
            Facade._instance = new Facade();
        }
        return Facade._instance;
    }

    private _models?: IModel;
    private _controllers?: IController;
    private _observers: Map<string, IObserver[]>

    constructor() {
        this._observers = new Map<string, IObserver[]>();
        this.initializeFacade();
    }

    private initializeFacade(): void {
        this.initializeModel();
        this.initializeController();
    }

    private initializeModel(): void {
        if (this._models === undefined) {
            this._models = Model.getInstance();
        }
    }

    private initializeController(): void {
        if (this._controllers === undefined) {
            this._controllers = Controller.getInstance();
        }
    }

    registerProxy(proxy: IProxy): void {
        this._models!.registerProxy(proxy);
    }

    removeProxy(proxyName: string): MaybeUndefined<IProxy> {
        return this._models!.removeProxy(proxyName);
    }

    retrieveProxy<T extends IProxy>(proxyName: string, cls: Class<T>): MaybeUndefined<T> {
        return this._models!.retriveProxy<T>(proxyName, cls);
    }

    hasProxy(proxyName: string): boolean {
        return this._models!.hasProxy(proxyName);
    }

    registerMediator(mediator: IMediator): void {
        this._controllers!.registerMediator(mediator);
    }

    removeMediator(mediatorName: string): MaybeUndefined<IMediator> {
        return this._controllers!.removeMediator(mediatorName);
    }

    retrieveMediator<T extends IMediator>(mediatorName: string, cls: Class<T>): MaybeUndefined<T> {
        return this._controllers!.retrieveMediator<T>(mediatorName, cls);
    }

    hasMediator(mediatorName: string): boolean {
        return this._controllers!.hasMediator(mediatorName);
    }

    registerObserver(notificationName: string, observer: IObserver): void {
        const observers = this._observers.get(notificationName);
        if (observers == null) {
            this._observers.set(notificationName, [observer]);
        } else {
            observers.push(observer);
        }
    }

    removeObserver(notificationName: string, notifyContext: any): void {
        const observers = this._observers.get(notificationName);
        if (observers == null) {
            return;
        }

        var idx: number = observers.length;
        while (idx--) {
            const observer: IObserver = observers[idx];
            if (observer.compareNotifyContext(notifyContext)) {
                observers.splice(idx, 1);
                break;
            }
        }

        if (observers.length === 0) {
            this._observers.delete(notificationName);
        }
    }

    notifyObservers(notification: INotification): void {
        const notificationName: string = notification.getName();
        const observers = this._observers.get(notificationName);
        if (observers) {
            const shadowObservers = observers.slice();
            const len = shadowObservers.length;
            for (let i = 0; i < len; i++) {
                const observer = shadowObservers[i];
                observer.notifyObserver(notification);
            }
        }
    }

    sendNotification(name: string, body?: any, type?: string): void {
        this.notifyObservers(new Notification(name, body, type))
    }
}

export default Facade;