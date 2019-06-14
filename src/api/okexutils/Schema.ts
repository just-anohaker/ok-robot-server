import ajv = require("ajv");

import { Validation } from "../Types";

class Schema {
    private static validator: ajv.Ajv = ajv();

    static validateGetSpotTicker(data: any): Validation {
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

    static validateGetSpotTrade(data: any): Validation {
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

    static validateGetSpotCandles(data: any): Validation {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                instrument_id: { type: "string", minLength: 1 },
                params: { type: "object" }
            },
            // required: ["instrument_id"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
}

export default Schema;