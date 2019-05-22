"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Model = /** @class */ (function () {
    function Model() {
        this._proxies = new Map();
        this.initializeModel();
    }
    Model.getInstance = function () {
        if (Model._instance === undefined) {
            Model._instance = new Model();
        }
        return Model._instance;
    };
    Model.prototype.initializeModel = function () {
    };
    Model.prototype.registerProxy = function (proxy) {
        if (this.hasProxy(proxy.proxyName)) {
            // TODO: proxy is exists;
            return;
        }
        this._proxies.set(proxy.proxyName, proxy);
        proxy.onRegister();
    };
    Model.prototype.removeProxy = function (proxyName) {
        if (!this.hasProxy(proxyName)) {
            return undefined;
        }
        var proxyInst = this._proxies.get(proxyName);
        this._proxies.delete(proxyName);
        proxyInst.onRemove();
        return proxyInst;
    };
    Model.prototype.retriveProxy = function (proxyName, cls) {
        if (!this.hasProxy(proxyName)) {
            return undefined;
        }
        var proxyInst = this._proxies.get(proxyName);
        if (proxyInst instanceof cls) {
            return proxyInst;
        }
        return undefined;
    };
    Model.prototype.hasProxy = function (proxyName) {
        return this._proxies.has(proxyName) !== undefined;
    };
    return Model;
}());
exports.default = Model;
