"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Notification = /** @class */ (function () {
    function Notification(name, body, type) {
        this.name = name;
        this.body = body;
        this.type = type;
    }
    Notification.prototype.getName = function () {
        return this.name;
    };
    Notification.prototype.setBody = function (body) {
        this.body = body;
    };
    Notification.prototype.getBody = function () {
        return this.body;
    };
    Notification.prototype.setType = function (type) {
        this.type = type;
    };
    Notification.prototype.getType = function () {
        return this.type;
    };
    Notification.prototype.toString = function () {
        var msg = "Notification Name: " + this.getName();
        msg += "\nBody:" + ((this.getBody() == null) ? "null" : this.getBody().toString());
        msg += "\nType:" + ((this.getType() == null) ? "null" : this.getType());
        return msg;
    };
    return Notification;
}());
exports.default = Notification;
