module.exports = class ApiError extends Error {

    status;
    errors;

    constructor(status, message , errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() { // if user is not authorized
        return new ApiError(401, "user is not authorized");
    }

    static BadRequest(message , errors = []) { // if we got wrong parameters or wrong types of parameters
        return new ApiError(400, message, errors);
    }

    static MailFail(message) {
        return new ApiError(502, message);
    }
}