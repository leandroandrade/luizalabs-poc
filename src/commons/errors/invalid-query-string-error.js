module.exports = class InvalidQueryStringError extends Error {
    constructor(message, statusCode) {
        super(message || 'Query String Error');
        this.name = 'InvalidQueryStringError';
        this.statusCode = statusCode || 400;
    }
};
