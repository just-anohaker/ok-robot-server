import { Validation } from "../Types";
declare class Schema {
    private static validator;
    static validateMonitSpotTrade(data: any): Validation;
    static validateUnmonitSpotTrade(data: any): Validation;
    static validateMonitSpotTicker(data: any): Validation;
    static validateUnmonitSpotTicker(data: any): Validation;
}
export default Schema;
