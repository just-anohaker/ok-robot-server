import Mediator from "../../patterns/mediator/Mediator";
import { IAccount } from "../Types";
declare class UserMediator extends Mediator {
    static NAME: string;
    private _userProxy?;
    constructor();
    private _checkProxy;
    getAllUsers(): IAccount[];
}
export default UserMediator;
