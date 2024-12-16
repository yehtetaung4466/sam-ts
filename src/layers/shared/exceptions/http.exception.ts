import { StatusCodes } from "http-status-codes";
import ResponseObj from "../classes/ResponseObj";

export default class HttpException extends ResponseObj<null> {
    constructor(public statusCode:StatusCodes,public messages?:string[]) {
        const errorMessage = messages || ['Unknown Error']
        super(statusCode , errorMessage, null);
    }
}