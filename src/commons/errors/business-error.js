module.exports = class BusinessError extends Error {
    constructor(message, statusCode) {
        super(message || 'Business Error');
        this.name = 'BusinessError';
        this.statusCode = statusCode || 400;
    }
};
