import INotifier from "./INotifier";
interface IProxy extends INotifier {
    readonly proxyName: string;
    onRegister(): void;
    onRemove(): void;
}
export default IProxy;
