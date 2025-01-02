import { StatusCodes } from "http-status-codes";
import ResponseObj from "../classes/ResponseObj";

export default class HttpException extends ResponseObj<any> {
    constructor(public statusCode:StatusCodes,public message?:string[],private err?:any) {
        const errorMessage = message || ['Unknown Error']
        super(statusCode , errorMessage, err);
    }
}