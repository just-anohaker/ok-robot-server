"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Notification {
    constructor(name, body, type) {
        this.name = name;
        this.body = body;
        this.type = type;
    }
    getName() {
        return this.name;
    }
    setBody(body) {
        this.body = body;
    }
    getBody() {
        return this.body;
    }
    setType(type) {
        this.type = type;
    }
    getType() {
        return this.type;
    }
    toString() {
        var msg = "Notification Name: " + this.getName();
        msg += "\nBody:" + ((this.getBody() == null) ? "null" : this.getBody().toString());
        msg += "\nType:" + ((this.getType() == null) ? "null" : this.getType());
        return msg;
    }
}
exports.default = Notification;
