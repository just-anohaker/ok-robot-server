import { Validation } from "../Types";
declare class Schema {
    private static validator;
    static validateGetSpotTicker(data: any): Validation;
    static validateGetSpotTrade(data: any): Validation;
    static validateGetSpotCandles(data: any): Validation;
}
export default Schema;
