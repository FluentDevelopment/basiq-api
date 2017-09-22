import * as request from 'superagent';

export class BasiqApiError extends Error {
    status: number;
    message: string;
    response?: request.Response

    constructor(status: number, message: string, response?: request.Response) {
        super(BasiqApiError.createMessage(status, message, response));

        this.status = status;
        this.response = response;
    }

    private static createMessage(status: number, message: string, response?: request.Response) {
        let errorMessage = `${status} ${message}`;

        if (response &&
            Object.prototype.hasOwnProperty.call(response, 'body') &&
            Object.prototype.hasOwnProperty.call(response.body, 'errorMessage')) {
            errorMessage += ` - ${response.body.errorMessage}`
        }
        return errorMessage;
    }
}