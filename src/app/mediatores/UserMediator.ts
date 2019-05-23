import Mediator from "../../patterns/mediator/Mediator";

import UserProxy, { IAccount } from "../proxies/UserProxy";
import { MaybeUndefined } from "../../base/Common";

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
        const userGroup = this._userProxy!.Groups;
        let result: IAccount[] = [];
        if (userGroup) {
            userGroup.forEach(group => {
                group.accounts.forEach(account => result.push(account));
            });
        }
        return result;
    }

}

export default UserMediator;