"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../Utils");
const Schema_1 = __importDefault(require("./Schema"));
function generate(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateGenerate(data);
        if (validation !== undefined) {
            return Utils_1.apiFailure(validation);
        }
        const resp = Utils_1.ProxyHelper.TakeOrderProxy.generate(data.options, data.account);
        return Utils_1.apiSuccess(resp);
    });
}
function start(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = Schema_1.default.validateStart(data);
        if (validation !== undefined) {
            return Utils_1.apiFailure(validation);
        }
        const bResp = Utils_1.ProxyHelper.TakeOrderProxy.start(data.client_oids);
        return Utils_1.apiSuccess(bResp);
    });
}
exports.default = {
    generate,
    start
};
