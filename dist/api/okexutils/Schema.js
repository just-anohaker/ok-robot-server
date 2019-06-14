"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ajv = require("ajv");
class Schema {
    static validateGetSpotTicker(data) {
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
    static validateGetSpotTrade(data) {
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
    static validateGetSpotCandles(data) {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                instrument_id: { type: "string", minLength: 1 },
                params: { type: "object" }
            },
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
}
Schema.validator = ajv();
exports.default = Schema;
