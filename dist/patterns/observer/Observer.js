"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observer = /** @class */ (function () {
    function Observer(notifyMethod, notifyContext) {
        this.setNotifyMethod(notifyMethod);
        this.setNotifyContext(notifyContext);
    }
    Observer.prototype.getNotifyMethod = function () {
        return this.notify;
    };
    Observer.prototype.setNotifyMethod = function (notifyMethod) {
        this.notify = notifyMethod;
    };
    Observer.prototype.getNotifyContext = function () {
        this.context;
    };
    Observer.prototype.setNotifyContext = function (notifyContext) {
        this.context = notifyContext;
    };
    Observer.prototype.notifyObserver = function (notification) {
        this.getNotifyMethod().call(this.getNotifyContext(), notification);
    };
    Observer.prototype.compareNotifyContext = function (context) {
        return context === this.context;
    };
    return Observer;
}());
exports.default = Observer;
