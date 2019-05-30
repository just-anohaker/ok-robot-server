"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var Platform_1 = require("./base/Platform");
exports.Platform = Platform_1.default;
// /> implements for interfaces
var Facade_1 = require("./patterns/facade/Facade");
exports.Facade = Facade_1.default;
var Observer_1 = require("./patterns/observer/Observer");
exports.Observer = Observer_1.default;
var Notifier_1 = require("./patterns/observer/Notifier");
exports.Notifier = Notifier_1.default;
var Notification_1 = require("./patterns/observer/Notification");
exports.Notification = Notification_1.default;
// base of mediator and proxy component
var Proxy_1 = require("./patterns/proxy/Proxy");
exports.Proxy = Proxy_1.default;
var Mediator_1 = require("./patterns/mediator/Mediator");
exports.Mediator = Mediator_1.default;
// /> factor service logic
__export(require("./app/Types"));
// /> mediator
var UserMediator_1 = require("./app/mediatores/UserMediator");
exports.UserMediator = UserMediator_1.default;
// /> proxy
var UserProxy_1 = require("./app/proxies/UserProxy");
exports.UserProxy = UserProxy_1.default;
var VolumeMaker_1 = require("./app/proxies/VolumeMaker");
exports.VolumeProxy = VolumeMaker_1.default;
// /> api
__export(require("./api"));
