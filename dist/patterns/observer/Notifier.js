"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Facade_1 = __importDefault(require("../facade/Facade"));
class Notifier {
    constructor() {
        this.facade = Facade_1.default.getInstance();
    }
    sendNotification(name, body = null, type = "") {
        this.facade.sendNotification(name, body, type);
    }
}
exports.default = Notifier;
