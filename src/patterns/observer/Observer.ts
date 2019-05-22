import IObserver from "../../interfaces/IObserver";
import INotification from "../../interfaces/INotification";

class Observer implements IObserver {
    protected notify?: Function;
    protected context?: any;

    constructor(notifyMethod: Function, notifyContext: any) {
        this.setNotifyMethod(notifyMethod);
        this.setNotifyContext(notifyContext);
    }

    private getNotifyMethod(): Function {
        return this.notify;
    }

    setNotifyMethod(notifyMethod: Function): void {
        this.notify = notifyMethod;
    }

    private getNotifyContext(): any {
        this.context;
    }

    setNotifyContext(notifyContext: any): void {
        this.context = notifyContext;
    }

    notifyObserver(notification: INotification): void {
        this.getNotifyMethod().call(this.getNotifyContext(), notification);
    }

    compareNotifyContext(context: any): boolean {
        return context === this.context;
    }
}

export default Observer;