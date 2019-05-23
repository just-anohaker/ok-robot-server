"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function apiSuccess(result) {
    return {
        success: true,
        result
    };
}
exports.apiSuccess = apiSuccess;
function apiFailure(error) {
    return {
        success: false,
        error
    };
}
exports.apiFailure = apiFailure;
