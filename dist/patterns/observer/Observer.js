"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Observer {
    constructor(notifyMethod, notifyContext) {
        this.setNotifyMethod(notifyMethod);
        this.setNotifyContext(notifyContext);
    }
    getNotifyMethod() {
        return this.notify;
    }
    setNotifyMethod(notifyMethod) {
        this.notify = notifyMethod;
    }
    getNotifyContext() {
        this.context;
    }
    setNotifyContext(notifyContext) {
        this.context = notifyContext;
    }
    notifyObserver(notification) {
        this.getNotifyMethod().call(this.getNotifyContext(), notification);
    }
    compareNotifyContext(context) {
        return context === this.context;
    }
}
exports.default = Observer;
