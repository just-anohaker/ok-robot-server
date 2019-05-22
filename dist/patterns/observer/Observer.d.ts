import IObserver from "../../interfaces/IObserver";
import INotification from "../../interfaces/INotification";
declare class Observer implements IObserver {
    protected notify?: Function;
    protected context?: any;
    constructor(notifyMethod: Function, notifyContext: any);
    private getNotifyMethod;
    setNotifyMethod(notifyMethod: Function): void;
    private getNotifyContext;
    setNotifyContext(notifyContext: any): void;
    notifyObserver(notification: INotification): void;
    compareNotifyContext(context: any): boolean;
}
export default Observer;
