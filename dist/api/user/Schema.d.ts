import { Validation } from "../Common";
declare class Schema {
    private static validator;
    static validateGetUser(body: any): Validation;
    static validateAddUser(body: any): Validation;
    static validateRemoveUser(body: any): Validation;
    static validateUpdateUser(body: any): Validation;
}
export default Schema;
