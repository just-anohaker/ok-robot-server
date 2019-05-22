import Notifier from "../observer/Notifier";
import IMediator from "../../interfaces/IMediator";
import INotifier from "../../interfaces/INotifier";

class Mediator extends Notifier implements IMediator, INotifier {
    constructor(private name: string) {
        super();
    }

    get mediatorName(): string {
        return this.name;
    }

    onRegister(): void {

    }

    onRemove(): void {

    }
}

export default Mediator;