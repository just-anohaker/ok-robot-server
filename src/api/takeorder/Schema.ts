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
                    // properties: {
                    //     type: { type: "integer", enum: [1, 2] },
                    //     toPrice: { type: "number" },
                    // },
                    // required: ["type", "toPrice"]
                },
                account: {
                    type: "object",
                    // properties: {
                    //     name: { type: "string" },
                    //     httpKey: { type: "string" },
                    //     httpSecret: { type: "string" },
                    //     passphrase: { type: "string" }
                    // },
                    // required: ["name", "httpKey", "httpSecret", "passphrase"]
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

export default Schema;