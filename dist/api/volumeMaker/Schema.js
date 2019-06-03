// import ajv = require("ajv");
// import { Validation } from "../Types";
// class Schema {
//     private static validator: ajv.Ajv = ajv();
//     static validateSetOptions(body: any): Validation {
//         const validation = Schema.validator.validate({
//             type: "object",
//             properties: {
//                 options: {
//                     type: "object",
//                     properties: {
//                         type: {type: "integer"},
//                         topPrice: {type: "flot"},
//                         bottomPrice: {type: "float"},
//                         intervalTime: {type: "integer"},
//                         volumn: {type: "integer"}
//                     },
//                     required: ["type", "topPrice", "bottomPrice", "intervalTime", "valumn"]
//                 },
//                 account: {
//                     type: "object",
//                     properties: {
//                         name: {type: "string"},
//                         httpKey: {type: "string"},
//                         httpSecret: {type: "string"},
//                         passphrase: {type: "string"}
//                     },
//                     required: ["name", "httpKey", "httpSecret", "passphrase"]
//                 }
//             },
//             required: ["options", "account"]
//         }, body);
//         if (validation) {
//             return undefined;
//         }
//         return Schema.validator.errorsText();
//     }
//     // static validateGetUser(body: any): Validation {
//     //     const validation = Schema.validator.validate({
//     //         type: "object",
//     //         properties: {
//     //             userId: { type: "string", minLength: 1 }
//     //         },
//     //         required: ["userId"]
//     //     }, body);
//     //     if (validation) {
//     //         return undefined;
//     //     }
//     //     return Schema.validator.errorsText();
//     // }
//     // static validateAddUser(body: any): Validation {
//     //     const validation = Schema.validator.validate({
//     //         type: "object",
//     //         properties: {
//     //             groupName: { type: "string", minLength: 1 },
//     //             name: { type: "string", minLength: 1 },
//     //             apiKey: { type: "string", minLength: 1 },
//     //             apiSecret: { type: "string", minLength: 1 }
//     //         },
//     //         required: ["groupName", "name", "apiKey", "apiSecret"]
//     //     }, body);
//     //     if (validation) {
//     //         return undefined;
//     //     }
//     //     return Schema.validator.errorsText();
//     // }
//     // static validateRemoveUser(body: any): Validation {
//     //     const validation = Schema.validator.validate({
//     //         type: "object",
//     //         properties: {
//     //             userId: { type: "string", minLength: 1 }
//     //         },
//     //         required: ["userId"]
//     //     }, body);
//     //     if (validation) {
//     //         return undefined;
//     //     }
//     //     return Schema.validator.errorsText();
//     // }
//     // static validateUpdateUser(body: any): Validation {
//     //     const validation = Schema.validator.validate({
//     //         type: "object",
//     //         properties: {
//     //             userId: { type: "string", minLength: 1 },
//     //             options: {
//     //                 type: "object",
//     //                 properties: {
//     //                     groupName: { type: "string", minLength: 1 },
//     //                     name: { type: "string", minLength: 1 },
//     //                     apiKey: { type: "string", minLength: 1 },
//     //                     apiSecret: { type: "string", minLength: 1 }
//     //                 }
//     //             }
//     //         },
//     //         required: ["userId", "options"]
//     //     }, body);
//     //     if (validation) {
//     //         return undefined;
//     //     }
//     //     return Schema.validator.errorsText();
//     // }
// }
// export default Schema;
