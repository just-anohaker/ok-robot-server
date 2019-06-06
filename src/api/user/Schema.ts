import ajv = require("ajv");

import { Validation } from "../Types";

class Schema {
    private static validator: ajv.Ajv = ajv();

    static validateGetUser(body: any): Validation {
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

    static validateAddUser(body: any): Validation {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                groupName: { type: "string", minLength: 1 },
                name: { type: "string", minLength: 1 },
                httpkey: { type: "string", minLength: 1 },
                httpsecret: { type: "string", minLength: 1 },
                passphrase: { type: "string", minLength: 1 }
            },
            required: ["groupName", "name", "httpkey", "httpsecret", "passphrase"]
        }, body);
        if (validation) {
            return undefined;
        }
        return Schema.validator.errorsText();
    }

    static validateRemoveUser(body: any): Validation {
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

    static validateUpdateUser(body: any): Validation {
        const validation = Schema.validator.validate({
            type: "object",
            properties: {
                userId: { type: "string", minLength: 1 },
                options: {
                    type: "object",
                    properties: {
                        groupName: { type: "string", minLength: 1 },
                        name: { type: "string", minLength: 1 },
                        httpkey: { type: "string", minLength: 1 },
                        httpsecret: { type: "string", minLength: 1 },
                        passphrase: { type: "string", minLength: 1 }
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

export default Schema;