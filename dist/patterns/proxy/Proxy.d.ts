import IProxy from "../../interfaces/IProxy";
import Notifier from "../observer/Notifier";
import INotifier from "../../interfaces/INotifier";
declare class Proxy extends Notifier implements IProxy, INotifier {
    private name;
    constructor(name: string);
    readonly proxyName: string;
    onRegister(): void;
    onRemove(): void;
}
export default Proxy;
