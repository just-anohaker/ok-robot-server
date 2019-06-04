import ajv = require("ajv");

import { Validation } from "../Types";

class Schema {
    private static validator: ajv.Ajv = ajv();

    static validateInit(data: any): Validation {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                options: {
                    type: "object",
                    properties: {
                        topPrice: { type: "number" },
                        bottomPrice: { type: "number" },
                        costLimit: { type: "number" }
                    },
                    requied: ["topPrice", "bottomPrice", "costLimit"]
                },
                account: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        httpKey: { type: "string" },
                        httpSecret: { type: "string" },
                        passphrase: { type: "string" }
                    },
                    requied: ["name", "httpKey", "httpSecret", "passphrase"]
                }
            },
            requied: ["options", "account"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
}

export default Schema;