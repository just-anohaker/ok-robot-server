import INotification from "./INotification";
interface IObserver {
    setNotifyMethod(method: Function): void;
    setNotifyContext(context: any): void;
    notifyObserver(notification: INotification): void;
    compareNotifyContext(context: any): boolean;
}
export default IObserver;
