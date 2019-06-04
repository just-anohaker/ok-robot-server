"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ajv = require("ajv");
class Schema {
    static validateInit(body) {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                options: {
                    type: "object",
                    properties: {
                        type: { type: "integer", enum: [0, 1, 2] },
                        topPrice: { type: "number" },
                        bottomPrice: { type: "number" },
                        intervalTime: { type: "integer" },
                        startVolume: { type: "number" },
                        endVolume: { type: "number" },
                        tradeType: { type: "integer", enum: [0, 1] },
                        tradeLimit: { type: "integer" }
                    },
                    required: ["type", "topPrice", "bottomPrice", "intervalTime", "startVolume", "endVolume", "tradeType", "tradeLimit"]
                },
                account: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        httpKey: { type: "string" },
                        httpSecret: { type: "string" },
                        passphrase: { type: "string" }
                    },
                    required: ["name", "httpKey", "httpSecret", "passphrase"]
                }
            },
            required: ["options", "account"]
        }, body);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
}
Schema.validator = ajv();
exports.default = Schema;
