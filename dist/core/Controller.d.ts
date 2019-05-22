import IController from "../interfaces/IController";
import IMediator from "../interfaces/IMediator";
import Class from "../interfaces/IClass";
import { MaybeUndefined } from "../base/Common";
declare class Controller implements IController {
    private static _instance;
    static getInstance(): IController;
    private _mediators;
    private constructor();
    private initializeController;
    registerMediator(mediator: IMediator): void;
    removeMediator(mediatorName: string): MaybeUndefined<IMediator>;
    retrieveMediator<T extends IMediator>(mediatorName: string, cls: Class<T>): MaybeUndefined<T>;
    hasMediator(mediatorName: string): boolean;
}
export default Controller;
