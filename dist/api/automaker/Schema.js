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
                },
                account: {
                    type: "object",
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
