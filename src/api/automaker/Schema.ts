import ajv = require("ajv");

import { Validation } from "../Types";

class Schema {
    private static validator: ajv.Ajv = ajv();

    static validateInit(body: any): Validation {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                options: {
                    type: "object",
                    properties: {
                        type: { type: "integer", enum: [0, 1, 2] },
                        topPrice: { type: "integer" },
                        bottomPrice: { type: "integer" },
                        intervalTime: { type: "integer" },
                        startVolume: { type: "integer" },
                        endVolume: { type: "integer" },
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

export default Schema;