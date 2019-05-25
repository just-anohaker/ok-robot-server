import { GenericType } from "../base/Common";

export interface APIReturn {
    success: boolean;
    error?: string,
    result?: GenericType;
}

export type Validation = undefined | string;