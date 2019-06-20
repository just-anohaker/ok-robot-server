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
const Proxy_1 = __importDefault(require("../../../patterns/proxy/Proxy"));
const okex_node_1 = require("@okfe/okex-node");
class OkexUtilsProxy extends Proxy_1.default {
    constructor() {
        super(OkexUtilsProxy.NAME);
        this.publicClient = okex_node_1.PublicClient();
    }
    onRegister() {
        // TODO
    }
    getSpotTicker(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.publicClient.spot().getSpotTicker(args.instrument_id);
        });
    }
    getSpotTrade(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.publicClient.spot().getSpotTrade(args.instrument_id, args.params);
        });
    }
    getSpotCandles(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.publicClient.spot().getSpotCandles(args.instrument_id, args.params);
        });
    }
    getWallet(account, currencies) {
        return __awaiter(this, void 0, void 0, function* () {
            const authClient = okex_node_1.AuthenticatedClient(account.httpkey, account.httpsecret, account.passphrase);
            const resp = yield authClient.spot().getAccounts();
            console.log("[OkexUtilsProxy] getWallet:", resp);
            return resp.filter(wallet => currencies.includes(wallet.currency));
        });
    }
    getWalletList(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const authClient = okex_node_1.AuthenticatedClient(account.httpkey, account.httpsecret, account.passphrase);
            const resp = yield authClient.account().getCurrencies();
            return resp.map(wallet => ({ name: wallet.name, currency: wallet.currency }));
        });
    }
}
OkexUtilsProxy.NAME = "PROXY_OKEX_UTILS";
exports.default = OkexUtilsProxy;
