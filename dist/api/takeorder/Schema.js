"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ajv = require("ajv");
class Schema {
    static validateGenerate(data) {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                options: {
                    type: "object",
                    properties: {
                        type: { type: "integer", enum: [1, 2] },
                        toPrice: { type: "number" },
                    },
                    required: ["type", "toPrice"]
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
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
    static validateStart(data) {
        const validation = Schema.validator.validate({
            type: "array",
            items: {
                type: "string"
            },
            minItems: 1
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
}
Schema.validator = ajv();
exports.default = Schema;
