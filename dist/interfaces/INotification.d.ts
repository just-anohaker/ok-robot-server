import { MaybeUndefined } from "../base/Common";
interface INotification {
    getName(): string;
    setBody(body: any): void;
    getBody(): MaybeUndefined<any>;
    setType(type: string): void;
    getType(): MaybeUndefined<string>;
    toString(): string;
}
export default INotification;
