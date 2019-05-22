interface INotification {
    getName(): string;

    setBody(body: any): void;

    getBody(): any;

    setType(type: string): void;

    getType(): string;

    toString(): string;
}

export default INotification;