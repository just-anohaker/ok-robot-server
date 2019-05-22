"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mediator_1 = __importDefault(require("../../patterns/mediator/Mediator"));
class UserMediator extends Mediator_1.default {
    constructor() {
        super(UserMediator.NAME);
    }
}
UserMediator.NAME = "MEDIATOR_USER";
exports.default = UserMediator;
