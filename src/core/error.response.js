'use strict'

const { ReasonPhrases } = require("http-status-codes");

const statusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
}
const Reason = {
    FORBIDDEN: ' Bad Request Error',
    CONFLICT: 'Conflict error',
}

class ErrorResponse extends Error{
    constructor(message, status) {
        super(message)
        this.status = status;
    }
}
class ConflictRequestError extends ErrorResponse{
    constructor(message =  Reason.CONFLICT, status = statusCode.CONFLICT) {
        super(message, status )
    }
}

class BadRequestError extends ErrorResponse{
    constructor(message = Reason.FORBIDDEN, status = statusCode.FORBIDDEN) {
        super(message, status )
    }
}
class AuthFailureError extends ErrorResponse{
    constructor(message = ReasonPhrases.UNAUTHORIZED, status = statusCode.UNAUTHORIZED) {
        super(message, status )
    }
}
class NotFoundError extends ErrorResponse{
    constructor(message = ReasonPhrases.NOT_FOUND, status = statusCode.NOT_FOUND) {
        super(message, status )
    }
}
module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError
}