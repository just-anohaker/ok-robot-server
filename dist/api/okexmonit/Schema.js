"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ajv = require("ajv");
class Schema {
    static validateMonitSpotTrade(data) {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                instrument_id: { type: "string", minLenght: 1 }
            },
            required: ["instrument_id"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
    static validateUnmonitSpotTrade(data) {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                instrument_id: { type: "string", minLenght: 1 }
            },
            required: ["instrument_id"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
    static validateMonitSpotTicker(data) {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                instrument_id: { type: "string", minLenght: 1 }
            },
            required: ["instrument_id"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
    static validateUnmonitSpotTicker(data) {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                instrument_id: { type: "string", minLenght: 1 }
            },
            required: ["instrument_id"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
    static validateMonitSpotChannel(data) {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                channel_name: { type: "string", minLenght: 1 },
                filter: { type: "string", minLenght: 1 }
            },
            required: ["channel_name", "filter"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
    static validateUnmonitSpotChannel(data) {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                channel_name: { type: "string", minLenght: 1 },
                filter: { type: "string", minLenght: 1 }
            },
            required: ["channel_name", "filter"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
    static validateMonitSpotDepth(data) {
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
                instrument_id: { type: "string", minLenght: 1 }
            },
            required: ["account", "instrument_id"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
    static validateUnmonitSpotDepth(data) {
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
                instrument_id: { type: "string", minLenght: 1 }
            },
            required: ["account", "instrument_id"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
    static validateMonitWallet(data) {
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
                currency: { type: "string", minLenght: 1 }
            },
            required: ["account", "currency"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
    static validateUnmonitWallet(data) {
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
                currency: { type: "string", minLenght: 1 }
            },
            required: ["account", "currency"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
}
Schema.validator = ajv();
exports.default = Schema;
