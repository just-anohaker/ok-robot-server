import IMediator from "./IMediator";
import Class from "./IClass";
import { MaybeUndefined } from "../base/Common";
interface IController {
    registerMediator(mediator: IMediator): void;
    removeMediator(mediatorName: string): MaybeUndefined<IMediator>;
    retrieveMediator<T extends IMediator>(mediatorName: string, typeChecker: Class<T>): MaybeUndefined<T>;
    hasMediator(mediatorName: string): boolean;
}
export default IController;
