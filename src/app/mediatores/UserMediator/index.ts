import Mediator from "../../../patterns/mediator/Mediator";
import UserProxy from "../../proxies/UserProxy";
import { Account } from "../../Types";

class UserMediator extends Mediator {
    static NAME: string = "MEDIATOR_USER";

    constructor() {
        super(UserMediator.NAME);
    }

    private get UserProxy(): UserProxy {
        return this.facade.retrieveProxy(UserProxy.NAME, UserProxy)!;
    }

    public getAllUsers(): Account[] {
        const allUsers = this.UserProxy.AllAccounts;
        allUsers.sort((a: Account, b: Account): number => {
            return a > b ? -1 : (a < b ? 1 : 0);
        });

        return allUsers;
    }

}

export default UserMediator;