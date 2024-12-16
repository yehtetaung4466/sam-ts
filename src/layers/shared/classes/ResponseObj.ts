import {StatusCodes} from 'http-status-codes'
export default class ResponseObj<T> {
    public body: string;
  
    constructor(public statusCode: StatusCodes, public message?: string[], private data?: T) {
      this.body = JSON.stringify({
        message: this.message,
        data: this.data,
      });
      delete this.message
      delete this.data

    }
  }
  