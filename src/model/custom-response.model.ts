
export class CustomResponseModel {
    public success: boolean;
    public message: string;
    public httpStatus: number;

    constructor(customResponseModelArgs: CustomResponseModelArgs){
        this.success = customResponseModelArgs.success || true;
        this.message = customResponseModelArgs.message;
        this.httpStatus = customResponseModelArgs.httpStatus || 200;
    }
}

export interface CustomResponseModelArgs {
    success?: boolean;
    message: string;
    httpStatus?: number;
}