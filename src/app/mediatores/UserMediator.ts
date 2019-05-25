import Mediator from "../../patterns/mediator/Mediator";

import UserProxy from "../proxies/UserProxy";
import { IAccount } from "../Types";

class UserMediator extends Mediator {
    static NAME: string = "MEDIATOR_USER";

    private _userProxy?: UserProxy;

    constructor() {
        super(UserMediator.NAME);
    }

    private _checkProxy(): void {
        if (this._userProxy === undefined) {
            this._userProxy = this.facade.retrieveProxy(UserProxy.NAME, UserProxy);
        }
    }

    public getAllUsers(): IAccount[] {
        this._checkProxy();
        const allUsers = this._userProxy!.AllAccounts;
        allUsers.sort((a: IAccount, b: IAccount): number => {
            return a > b ? -1 : (a < b ? 1 : 0);
        });

        return allUsers;
    }

}

export default UserMediator;