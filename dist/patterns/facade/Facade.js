"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Model_1 = __importDefault(require("../../core/Model"));
var Controller_1 = __importDefault(require("../../core/Controller"));
var Notification_1 = __importDefault(require("../../patterns/observer/Notification"));
var Facade = /** @class */ (function () {
    function Facade() {
        this._observers = new Map();
        this.initializeFacade();
    }
    Facade.getInstance = function () {
        if (Facade._instance === undefined) {
            Facade._instance = new Facade();
        }
        return Facade._instance;
    };
    Facade.prototype.initializeFacade = function () {
        this.initializeModel();
        this.initializeController();
    };
    Facade.prototype.initializeModel = function () {
        if (this._models === undefined) {
            this._models = Model_1.default.getInstance();
        }
    };
    Facade.prototype.initializeController = function () {
        if (this._controllers === undefined) {
            this._controllers = Controller_1.default.getInstance();
        }
    };
    Facade.prototype.registerProxy = function (proxy) {
        this._models.registerProxy(proxy);
    };
    Facade.prototype.removeProxy = function (proxyName) {
        return this._models.removeProxy(proxyName);
    };
    Facade.prototype.retrieveProxy = function (proxyName, cls) {
        return this._models.retriveProxy(proxyName, cls);
    };
    Facade.prototype.hasProxy = function (proxyName) {
        return this._models.hasProxy(proxyName);
    };
    Facade.prototype.registerMediator = function (mediator) {
        this._controllers.registerMediator(mediator);
    };
    Facade.prototype.removeMediator = function (mediatorName) {
        return this._controllers.removeMediator(mediatorName);
    };
    Facade.prototype.retrieveMediator = function (mediatorName, cls) {
        return this._controllers.retrieveMediator(mediatorName, cls);
    };
    Facade.prototype.hasMediator = function (mediatorName) {
        return this._controllers.hasMediator(mediatorName);
    };
    Facade.prototype.registerObserver = function (notificationName, observer) {
        var observers = this._observers.get(notificationName);
        if (observers == null) {
            this._observers.set(notificationName, [observer]);
        }
        else {
            observers.push(observer);
        }
    };
    Facade.prototype.removeObserver = function (notificationName, notifyContext) {
        var observers = this._observers.get(notificationName);
        if (observers == null) {
            return;
        }
        var idx = observers.length;
        while (idx--) {
            var observer = observers[idx];
            if (observer.compareNotifyContext(notifyContext)) {
                observers.splice(idx, 1);
                break;
            }
        }
        if (observers.length === 0) {
            this._observers.delete(notificationName);
        }
    };
    Facade.prototype.notifyObservers = function (notification) {
        var notificationName = notification.getName();
        var observers = this._observers.get(notificationName);
        if (observers) {
            var shadowObservers = observers.slice();
            var len = shadowObservers.length;
            for (var i = 0; i < len; i++) {
                var observer = shadowObservers[i];
                observer.notifyObserver(notification);
            }
        }
    };
    Facade.prototype.sendNotification = function (name, body, type) {
        this.notifyObservers(new Notification_1.default(name, body, type));
    };
    return Facade;
}());
exports.default = Facade;
