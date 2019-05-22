import INotifier from "../../interfaces/INotifier";
import IFacade from "../../interfaces/IFacade";
import Facade from "../facade/Facade";

class Notifier implements INotifier {
    private facade: IFacade;

    constructor() {
        this.facade = Facade.getInstance();
    }

    sendNotification(name: string, body: any = null, type: string = null): void {
        this.facade.sendNotification(name, body, type);
    }
}

export default Notifier;