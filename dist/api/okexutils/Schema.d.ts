import { Validation } from "../Types";
declare class Schema {
    private static validator;
    static validateGetSpotTicker(data: any): Validation;
    static validateGetSpotTrade(data: any): Validation;
    static validateGetSpotCandles(data: any): Validation;
    static validateGetWallet(data: any): Validation;
    static validateGetWalletList(data: any): Validation;
}
export default Schema;
