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
                },
                account: {
                    type: "object",
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
        const validation = Schema.validator.validate(/*{
            type: "array",
            items: {
                type: "string"
            },
            minItems: 1
        }*/ {
            type: "object"
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
}
Schema.validator = ajv();
exports.default = Schema;
