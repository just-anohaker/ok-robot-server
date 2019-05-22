"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Model {
    static getInstance() {
        if (Model._instance === undefined) {
            Model._instance = new Model();
        }
        return Model._instance;
    }
    constructor() {
        this._proxies = new Map();
        this.initializeModel();
    }
    initializeModel() {
    }
    registerProxy(proxy) {
        if (this.hasProxy(proxy.proxyName)) {
            // TODO: proxy is exists;
            return;
        }
        this._proxies.set(proxy.proxyName, proxy);
        proxy.onRegister();
    }
    removeProxy(proxyName) {
        if (!this.hasProxy(proxyName)) {
            return undefined;
        }
        const proxyInst = this._proxies.get(proxyName);
        this._proxies.delete(proxyName);
        proxyInst.onRemove();
        return proxyInst;
    }
    retriveProxy(proxyName, cls) {
        if (!this.hasProxy(proxyName)) {
            return undefined;
        }
        const proxyInst = this._proxies.get(proxyName);
        if (proxyInst instanceof cls) {
            return proxyInst;
        }
        return undefined;
    }
    hasProxy(proxyName) {
        return this._proxies.has(proxyName) !== undefined;
    }
}
exports.default = Model;
