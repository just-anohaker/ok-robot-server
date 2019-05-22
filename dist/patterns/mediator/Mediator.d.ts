import Notifier from "../observer/Notifier";
import IMediator from "../../interfaces/IMediator";
import INotifier from "../../interfaces/INotifier";
declare class Mediator extends Notifier implements IMediator, INotifier {
    private name;
    constructor(name: string);
    readonly mediatorName: string;
    onRegister(): void;
    onRemove(): void;
}
export default Mediator;
