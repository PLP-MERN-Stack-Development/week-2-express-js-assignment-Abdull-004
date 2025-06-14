class NotFoundError extends Error {
    constructor(message = 'Resource not found') {
        super(message);
        this.name = 'NotFoundError';
        this.status = 404;
    }
}

class ValidationError extends Error {
    constructor(mmessage = 'Validation failed') {
        super(message);
        this.name = 'ValidationError';
        this.status = 400;
    } 
}

class AuthError extends Error {
    constructor(message = 'Authentication failed') {
        super(message);
        this.name = 'AuthError';
        this.status = 401;
    }
}

module.exports = {
    NotFoundError,
    ValidationError,
    AuthError
};