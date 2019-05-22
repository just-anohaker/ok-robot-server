import INotification from "../../interfaces/INotification";
import { MaybeUndefined } from "../../base/Common";

class Notification implements INotification {
    constructor(private name: string, private body?: any, private type?: string) { }

    getName(): string {
        return this.name;
    }

    setBody(body: any): void {
        this.body = body;
    }

    getBody(): MaybeUndefined<any> {
        return this.body;
    }

    setType(type: string): void {
        this.type = type;
    }

    getType(): MaybeUndefined<string> {
        return this.type;
    }

    toString(): string {
        var msg: string = "Notification Name: " + this.getName();
        msg += "\nBody:" + ((this.getBody() == null) ? "null" : this.getBody().toString());
        msg += "\nType:" + ((this.getType() == null) ? "null" : this.getType());
        return msg;
    }
}

export default Notification;