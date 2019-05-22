import Mediator from "../../patterns/mediator/Mediator";

class UserMediator extends Mediator {
    static NAME: string = "MEDIATOR_USER";

    constructor() {
        super(UserMediator.NAME);
    }

}

export default UserMediator;