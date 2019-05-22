"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Facade_1 = require("./patterns/facade/Facade");
exports.Facade = Facade_1.default;
var Mediator_1 = require("./patterns/mediator/Mediator");
exports.Mediator = Mediator_1.default;
var Proxy_1 = require("./patterns/proxy/Proxy");
exports.Proxy = Proxy_1.default;
var Observer_1 = require("./patterns/observer/Observer");
exports.Observer = Observer_1.default;
var Notifier_1 = require("./patterns/observer/Notifier");
exports.Notifier = Notifier_1.default;
var Notification_1 = require("./patterns/observer/Notification");
exports.Notification = Notification_1.default;
// / user custom
// /> mediator
var User_1 = require("./app/mediatores/User");
exports.UserMediator = User_1.default;
// /> proxy
var User_2 = require("./app/proxies/User");
exports.UserProxy = User_2.default;
