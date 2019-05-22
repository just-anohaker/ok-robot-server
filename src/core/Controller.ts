import IController from "../interfaces/IController";
import IMediator from "../interfaces/IMediator";
import Class from "../interfaces/IClass";
import { MaybeUndefined } from "../base/Common";

class Controller implements IController {
    private static _instance: IController;

    static getInstance(): IController {
        if (Controller._instance === undefined) {
            Controller._instance = new Controller();
        }

        return Controller._instance;
    }

    private _mediators: Map<string, IMediator>;

    private constructor() {
        this._mediators = new Map<string, IMediator>();

        this.initializeController();
    }

    private initializeController(): void {

    }

    registerMediator(mediator: IMediator): void {
        if (this.hasMediator(mediator.mediatorName)) {
            return;
        }

        this._mediators.set(mediator.mediatorName, mediator);
        mediator.onRegister();
    }

    removeMediator(mediatorName: string): MaybeUndefined<IMediator> {
        if (!this.hasMediator(mediatorName)) {
            return undefined;
        }

        const mediatorInst = this._mediators.get(mediatorName)!;
        this._mediators.delete(mediatorInst.mediatorName);
        mediatorInst.onRemove();
        return mediatorInst;
    }

    retrieveMediator<T extends IMediator>(mediatorName: string, cls: Class<T>): MaybeUndefined<T> {
        if (!this.hasMediator(mediatorName)) {
            return undefined;
        }

        const mediatorInst = this._mediators.get(mediatorName);
        if (mediatorInst instanceof cls) {
            return mediatorInst as T;
        }
        return undefined;
    }

    hasMediator(mediatorName: string): boolean {
        return this._mediators.has(mediatorName);
    }

}

export default Controller;