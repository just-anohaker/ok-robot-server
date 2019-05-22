"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Notifier_1 = __importDefault(require("../observer/Notifier"));
var Mediator = /** @class */ (function (_super) {
    __extends(Mediator, _super);
    function Mediator(name) {
        var _this = _super.call(this) || this;
        _this.name = name;
        return _this;
    }
    Object.defineProperty(Mediator.prototype, "mediatorName", {
        get: function () {
            return this.name;
        },
        enumerable: true,
        configurable: true
    });
    Mediator.prototype.onRegister = function () {
    };
    Mediator.prototype.onRemove = function () {
    };
    return Mediator;
}(Notifier_1.default));
exports.default = Mediator;
