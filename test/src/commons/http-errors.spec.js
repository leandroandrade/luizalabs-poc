const httpErrors = require('../../../src/commons/http-errors');

describe('http-errors tests', () => {
    it('should validate error 404', done => {
        expect(httpErrors.isNotFound(null)).toBeFalsy();
        expect(httpErrors.isNotFound(undefined)).toBeFalsy();
        expect(httpErrors.isNotFound({})).toBeFalsy();
        expect(httpErrors.isNotFound({ status: 400 })).toBeFalsy();
        expect(httpErrors.isNotFound({ status: 404 })).toBeTruthy();

        done();
    });
});
