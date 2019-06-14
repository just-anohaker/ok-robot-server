import { Validation } from "../Types";
declare class Schema {
    private static validator;
    static validateMonitSpotTrade(data: any): Validation;
    static validateUnmonitSpotTrade(data: any): Validation;
    static validateMonitSpotTicker(data: any): Validation;
    static validateUnmonitSpotTicker(data: any): Validation;
    static validateMonitSpotChannel(data: any): Validation;
    static validateUnmonitSpotChannel(data: any): Validation;
}
export default Schema;
