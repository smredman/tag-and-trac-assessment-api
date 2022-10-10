export class ExpectedError {
    code: number;
    message: string;

    constructor(code: number = 500, message: string = "An error occurred") {
        this.code = code;
        this.message = message;
    }
}