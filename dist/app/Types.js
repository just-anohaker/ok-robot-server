"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TradeType;
(function (TradeType) {
    TradeType[TradeType["Both"] = 0] = "Both";
    TradeType[TradeType["OnlyBuy"] = 1] = "OnlyBuy";
    TradeType[TradeType["OnlySell"] = 2] = "OnlySell";
})(TradeType = exports.TradeType || (exports.TradeType = {}));
var TradeActionType;
(function (TradeActionType) {
    TradeActionType[TradeActionType["Withdrawal"] = 0] = "Withdrawal";
    TradeActionType[TradeActionType["Orders"] = 1] = "Orders";
})(TradeActionType = exports.TradeActionType || (exports.TradeActionType = {}));
exports.NotificationDeep = "spot/depth";
exports.NotificationTicker = "spot/ticker";
exports.NotificationOrder = "spot/order";
