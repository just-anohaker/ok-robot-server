import { Validation } from "../Types";
declare class Schema {
    private static validator;
    static validateInit(body: any): Validation;
}
export default Schema;
