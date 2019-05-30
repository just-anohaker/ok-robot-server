import INotification from "../../interfaces/INotification";
import { MaybeUndefined } from "../../base/Common";
declare class Notification implements INotification {
    private name;
    private body?;
    private type?;
    constructor(name: string, body?: any, type?: string);
    getName(): string;
    setBody(body: any): void;
    getBody(): MaybeUndefined<any>;
    setType(type: string): void;
    getType(): MaybeUndefined<string>;
    toString(): string;
}
export default Notification;
