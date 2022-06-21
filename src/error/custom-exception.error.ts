export default class CustomExceptionError extends Error {
    constructor(reason: string, public errorCode: string, public httpStatus: number){
        super(reason)
    }
}