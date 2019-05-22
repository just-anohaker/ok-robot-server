import INotifier from "../../interfaces/INotifier";
import IFacade from "../../interfaces/IFacade";
declare class Notifier implements INotifier {
    protected facade: IFacade;
    constructor();
    sendNotification(name: string, body?: any, type?: string): void;
}
export default Notifier;
