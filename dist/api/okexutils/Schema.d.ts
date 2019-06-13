import { Validation } from "../Types";
declare class Schema {
    private static validator;
    static validateGenerate(data: any): Validation;
    static validateStart(data: any): Validation;
    static validateCancel(data: any): Validation;
}
export default Schema;
