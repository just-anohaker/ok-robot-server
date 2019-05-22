"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Facade_1 = __importDefault(require("../facade/Facade"));
var Notifier = /** @class */ (function () {
    function Notifier() {
        this.facade = Facade_1.default.getInstance();
    }
    Notifier.prototype.sendNotification = function (name, body, type) {
        if (body === void 0) { body = null; }
        if (type === void 0) { type = ""; }
        this.facade.sendNotification(name, body, type);
    };
    return Notifier;
}());
exports.default = Notifier;
