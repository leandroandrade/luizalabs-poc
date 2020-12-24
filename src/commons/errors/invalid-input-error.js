module.exports = class InvalidInputError extends Error {
    constructor(message, statusCode) {
        super(message || 'Input Error');
        this.name = 'InvalidInputError';
        this.statusCode = statusCode || 400;
    }
};
