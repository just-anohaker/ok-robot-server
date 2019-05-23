import { GenericType } from "../base/Common";

export { MarkedMap } from "../base/Common";

export interface APIReturn {
    success: boolean;
    error?: string,
    result?: GenericType;
}

export type Validation = undefined | string;

export function apiSuccess(result: GenericType): APIReturn {
    return {
        success: true,
        result
    };
}

export function apiFailure(error: string): APIReturn {
    return {
        success: false,
        error
    };
}