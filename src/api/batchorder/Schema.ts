import ajv = require("ajv");

import { Validation } from "../Types";

class Schema {
    private static validator: ajv.Ajv = ajv();

    static validateGenerate(data: any): Validation {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                options: {
                    type: "object",
                    properties: {
                        type: { type: "integer", enum: [1, 2] },
                        topPrice: { type: "number" },
                        startPrice: { type: "number" },
                        incr: { type: "number" },
                        topSize: { type: "number" },
                        count: { type: "number" }
                    },
                    required: ["type", "topPrice", "startPrice", "incr", "topSize", "count"]
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

    static validateStart(data: any): Validation {
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

export default Schema;