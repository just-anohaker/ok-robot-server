import { GenericType } from "../base/Common";
export interface APIReturn {
    success: boolean;
    error?: string;
    result?: GenericType;
}
export declare type Validation = undefined | string;
