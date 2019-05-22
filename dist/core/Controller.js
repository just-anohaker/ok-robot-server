"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Controller = /** @class */ (function () {
    function Controller() {
        this._mediators = new Map();
        this.initializeController();
    }
    Controller.getInstance = function () {
        if (Controller._instance === undefined) {
            Controller._instance = new Controller();
        }
        return Controller._instance;
    };
    Controller.prototype.initializeController = function () {
    };
    Controller.prototype.registerMediator = function (mediator) {
        if (this.hasMediator(mediator.mediatorName)) {
            return;
        }
        this._mediators.set(mediator.mediatorName, mediator);
        mediator.onRegister();
    };
    Controller.prototype.removeMediator = function (mediatorName) {
        if (!this.hasMediator(mediatorName)) {
            return undefined;
        }
        var mediatorInst = this._mediators.get(mediatorName);
        this._mediators.delete(mediatorInst.mediatorName);
        mediatorInst.onRemove();
        return mediatorInst;
    };
    Controller.prototype.retrieveMediator = function (mediatorName, cls) {
        if (!this.hasMediator(mediatorName)) {
            return undefined;
        }
        var mediatorInst = this._mediators.get(mediatorName);
        if (mediatorInst instanceof cls) {
            return mediatorInst;
        }
        return undefined;
    };
    Controller.prototype.hasMediator = function (mediatorName) {
        return this._mediators.has(mediatorName) !== undefined;
    };
    return Controller;
}());
exports.default = Controller;
