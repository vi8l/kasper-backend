"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomExceptionError extends Error {
    constructor(reason, errorCode, httpStatus) {
        super(reason);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }
}
exports.default = CustomExceptionError;
