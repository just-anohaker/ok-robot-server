import ajv = require("ajv");

import { Validation } from "../Types";

class Schema {
    private static validator: ajv.Ajv = ajv();

    static validateMonitSpotTrade(data: any): Validation {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                instrument_id: { type: "string", minLenght: 1 }
            },
            required: ["instrument_id"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }

    static validateUnmonitSpotTrade(data: any): Validation {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                instrument_id: { type: "string", minLenght: 1 }
            },
            required: ["instrument_id"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }

    static validateMonitSpotTicker(data: any): Validation {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                instrument_id: { type: "string", minLenght: 1 }
            },
            required: ["instrument_id"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }

    static validateUnmonitSpotTicker(data: any): Validation {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                instrument_id: { type: "string", minLenght: 1 }
            },
            required: ["instrument_id"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }

    static validateMonitSpotChannel(data: any): Validation {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                channel_name: { type: "string", minLenght: 1 },
                filter: { type: "string", minLenght: 1 }
            },
            required: ["channel_name", "filter"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }

    static validateUnmonitSpotChannel(data: any): Validation {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                channel_name: { type: "string", minLenght: 1 },
                filter: { type: "string", minLenght: 1 }
            },
            required: ["channel_name", "filter"]
        }, data);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
}

export default Schema;