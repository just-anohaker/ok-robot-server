import Mediator from "../../../patterns/mediator/Mediator";
import { Account } from "../../Types";
declare class UserMediator extends Mediator {
    static NAME: string;
    constructor();
    private readonly UserProxy;
    getAllUsers(): Account[];
}
export default UserMediator;
