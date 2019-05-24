export interface IPlatform {
    getUserDataDir(): string;
}
declare class Platform implements IPlatform {
    private static _instance?;
    static getInstance(): Platform;
    private _platformImpl;
    constructor();
    setPlatform(platform: IPlatform): void;
    getUserDataDir(): string;
}
export default Platform;
