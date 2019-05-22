import IProxy from "../../interfaces/IProxy";
import Notifier from "../observer/Notifier";
import INotifier from "../../interfaces/INotifier";

class Proxy extends Notifier implements IProxy, INotifier {
    constructor(private name: string) {
        super();
    }

    get proxyName(): string {
        return this.name;
    }

    onRegister(): void {

    }

    onRemove(): void {

    }
}

export default Proxy;