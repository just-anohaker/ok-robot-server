"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = __importDefault(require("../../core/Model"));
const Controller_1 = __importDefault(require("../../core/Controller"));
const Notification_1 = __importDefault(require("../../patterns/observer/Notification"));
const sqlite3_1 = __importDefault(require("../../sqlite3"));
class Facade {
    static getInstance() {
        if (Facade._instance === undefined) {
            Facade._instance = new Facade();
        }
        return Facade._instance;
    }
    constructor() {
        this._observers = new Map();
        this.initializeFacade();
    }
    initializeFacade() {
        sqlite3_1.default.getInstance();
        this.initializeModel();
        this.initializeController();
    }
    initializeModel() {
        if (this._models === undefined) {
            this._models = Model_1.default.getInstance();
        }
    }
    initializeController() {
        if (this._controllers === undefined) {
            this._controllers = Controller_1.default.getInstance();
        }
    }
    registerProxy(proxy) {
        this._models.registerProxy(proxy);
    }
    removeProxy(proxyName) {
        return this._models.removeProxy(proxyName);
    }
    retrieveProxy(proxyName, cls) {
        return this._models.retriveProxy(proxyName, cls);
    }
    hasProxy(proxyName) {
        return this._models.hasProxy(proxyName);
    }
    registerMediator(mediator) {
        this._controllers.registerMediator(mediator);
    }
    removeMediator(mediatorName) {
        return this._controllers.removeMediator(mediatorName);
    }
    retrieveMediator(mediatorName, cls) {
        return this._controllers.retrieveMediator(mediatorName, cls);
    }
    hasMediator(mediatorName) {
        return this._controllers.hasMediator(mediatorName);
    }
    registerObserver(notificationName, observer) {
        const observers = this._observers.get(notificationName);
        if (observers == null) {
            this._observers.set(notificationName, [observer]);
        }
        else {
            observers.push(observer);
        }
    }
    removeObserver(notificationName, notifyContext) {
        const observers = this._observers.get(notificationName);
        if (observers == null) {
            return;
        }
        var idx = observers.length;
        while (idx--) {
            const observer = observers[idx];
            if (observer.compareNotifyContext(notifyContext)) {
                observers.splice(idx, 1);
                break;
            }
        }
        if (observers.length === 0) {
            this._observers.delete(notificationName);
        }
    }
    notifyObservers(notification) {
        const notificationName = notification.getName();
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
    sendNotification(name, body, type) {
        this.notifyObservers(new Notification_1.default(name, body, type));
    }
}
exports.default = Facade;
