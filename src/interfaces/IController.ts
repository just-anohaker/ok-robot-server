import IMediator from "./IMediator";
import Class from "./IClass";

interface IController {
    registerMediator(mediator: IMediator): void;

    removeMediator(mediatorName: string): IMediator;

    retrieveMediator<T extends IMediator>(mediatorName: string, typeChecker: Class<T>): T;

    hasMediator(mediatorName: string): boolean;
}

export default IController;