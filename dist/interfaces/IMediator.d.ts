import INotifier from "./INotifier";
interface IMediator extends INotifier {
    readonly mediatorName: string;
    onRegister(): void;
    onRemove(): void;
}
export default IMediator;
