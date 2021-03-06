"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ajv = require("ajv");
class Schema {
    static validateGetUser(body) {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                userId: { type: "string", minLength: 1 }
            },
            required: ["userId"]
        }, body);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
    static validateAddUser(body) {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                groupName: { type: "string", minLength: 1 },
                name: { type: "string", minLength: 1 },
                apiKey: { type: "string", minLength: 1 },
                apiSecret: { type: "string", minLength: 1 }
            },
            required: ["groupName", "name", "apiKey", "apiSecret"]
        }, body);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
    static validateRemoveUser(body) {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                userId: { type: "string", minLength: 1 }
            },
            required: ["userId"]
        }, body);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
    static validateUpdateUser(body) {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                userId: { type: "string", minLength: 1 },
                options: {
                    type: "object",
                    properties: {
                        groupName: { type: "string", minLength: 1 },
                        name: { type: "string", minLength: 1 },
                        apiKey: { type: "string", minLength: 1 },
                        apiSecret: { type: "string", minLength: 1 }
                    }
                }
            },
            required: ["userId", "options"]
        }, body);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }
}
Schema.validator = ajv();
exports.default = Schema;
