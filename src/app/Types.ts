export interface IAccount {
    id?: string;
    groupName?: string;
    name: string;
    apiKey: string;
    apiSecret: string;
}

export interface IUpdateAccount {
    groupName?: string;
    name?: string;
    apiKey?: string;
    apiSecret?: string;
}
