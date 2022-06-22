"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomResponseModel = void 0;
class CustomResponseModel {
    constructor(customResponseModelArgs) {
        this.success = customResponseModelArgs.success || true;
        this.message = customResponseModelArgs.message;
        this.httpStatus = customResponseModelArgs.httpStatus || 200;
    }
}
exports.CustomResponseModel = CustomResponseModel;
