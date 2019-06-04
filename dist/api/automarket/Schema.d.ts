import { Validation } from "../Types";
declare class Schema {
    private static validator;
    static validateInit(data: any): Validation;
}
export default Schema;
