import { OKexAccount } from "../../../Types";
declare class WalletMonitor {
    private httpKey;
    private httpSecret;
    private passphrase;
    private connection?;
    private _expiredTimeoutHandler?;
    private _isLogined;
    private _subscribeEvents;
    private _pendingSubscribeEvents;
    constructor(httpKey: string, httpSecret: string, passphrase: string);
    compareAccount(account: OKexAccount): boolean;
    private _checkOkexConnection;
    private _login;
    private _startExpiredTimer;
    private _stopExpiredTimer;
    monit(currency: string): Promise<string>;
    unmonit(currency: string): Promise<string>;
    private onOkexConnectionOpened;
    private onOkexConnectionClosed;
    private onOkexConnectionLogined;
    private onOkexConnectionMessage;
}
export default WalletMonitor;
