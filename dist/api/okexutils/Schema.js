"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ajv = require("ajv");
class Schema {
    static validateGetSpotTicker(data) {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                "instrument_id": { type: "string", minLength: 1 }
            }
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
    static validateGetSpotTrade(data) {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                instrument_id: { type: "string", minLength: 1 },
                params: { type: "object" }
            },
            required: ["instrument_id"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
    static validateGetSpotCandles(data) {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                instrument_id: { type: "string", minLength: 1 },
                params: { type: "object" }
            },
            required: ["instrument_id"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
    static validateGetWallet(data) {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                account: {
                    type: "object",
                    properties: {
                        httpkey: { type: "string", minLenght: 1 },
                        httpsecret: { type: "string", minLenght: 1 },
                        passphrase: { type: "string", minLenght: 1 }
                    },
                    required: ["httpkey", "httpsecret", "passphrase"]
                },
                currencies: {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    uniqueItems: true,
                    minItems: 1
                }
            },
            required: ["account", "currencies"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
    static validateGetWalletList(data) {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                account: {
                    type: "object",
                    properties: {
                        httpkey: { type: "string", minLenght: 1 },
                        httpsecret: { type: "string", minLenght: 1 },
                        passphrase: { type: "string", minLenght: 1 }
                    },
                    required: ["httpkey", "httpsecret", "passphrase"]
                }
            },
            required: ["account"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
}
Schema.validator = ajv();
exports.default = Schema;
