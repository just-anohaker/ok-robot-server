import { GenericType } from "../base/Common";
export { MarkedMap } from "../base/Common";
export interface APIReturn {
    success: boolean;
    error?: string;
    result?: GenericType;
}
export declare type Validation = undefined | string;
export declare function apiSuccess(result: GenericType): APIReturn;
export declare function apiFailure(error: string): APIReturn;
