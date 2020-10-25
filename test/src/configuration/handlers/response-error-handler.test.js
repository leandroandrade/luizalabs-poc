const httpError = require('../../../../src/commons/http-error');
const responseErrorHandler = require('../../../../src/configuration/handlers/response-error-handler');

describe('response-error-handler middleware', () => {
    it('should do something', async done => {
        const err = httpError.createError(400, 'some error');
        const res = {
            status: statusCode => ({
                send: response => ({ statusCode, mensagens: response.mensagens }),
            }),
        };
        const response = responseErrorHandler(err, jest.fn(), res, jest.fn());
        const { statusCode, mensagens } = response;

        expect(statusCode).toBe(400);
        expect(mensagens).not.toBeUndefined();

        done();
    });
});
