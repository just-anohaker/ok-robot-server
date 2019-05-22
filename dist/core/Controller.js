"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Controller {
    static getInstance() {
        if (Controller._instance === undefined) {
            Controller._instance = new Controller();
        }
        return Controller._instance;
    }
    constructor() {
        this._mediators = new Map();
        this.initializeController();
    }
    initializeController() {
    }
    registerMediator(mediator) {
        if (this.hasMediator(mediator.mediatorName)) {
            return;
        }
        this._mediators.set(mediator.mediatorName, mediator);
        mediator.onRegister();
    }
    removeMediator(mediatorName) {
        if (!this.hasMediator(mediatorName)) {
            return undefined;
        }
        const mediatorInst = this._mediators.get(mediatorName);
        this._mediators.delete(mediatorInst.mediatorName);
        mediatorInst.onRemove();
        return mediatorInst;
    }
    retrieveMediator(mediatorName, cls) {
        if (!this.hasMediator(mediatorName)) {
            return undefined;
        }
        const mediatorInst = this._mediators.get(mediatorName);
        if (mediatorInst instanceof cls) {
            return mediatorInst;
        }
        return undefined;
    }
    hasMediator(mediatorName) {
        return this._mediators.has(mediatorName) !== undefined;
    }
}
exports.default = Controller;
