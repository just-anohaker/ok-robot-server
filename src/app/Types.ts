export interface IAccount {
    id?: string;
    groupName?: string;
    name: string;
    apiKey: string;
    apiSecret: string;
}

export interface IUpdateAccount {
    readonly groupName?: string;
    readonly name?: string;
    readonly apiKey?: string;
    readonly apiSecret?: string;
}
