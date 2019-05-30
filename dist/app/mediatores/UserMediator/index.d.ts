import Mediator from "../../../patterns/mediator/Mediator";
import { IAccount } from "../../Types";
declare class UserMediator extends Mediator {
    static NAME: string;
    constructor();
    private readonly UserProxy;
    getAllUsers(): IAccount[];
}
export default UserMediator;
