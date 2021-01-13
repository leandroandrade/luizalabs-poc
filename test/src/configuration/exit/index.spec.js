jest.mock('../../../../src/configuration/databases/mongodb');
jest.mock('../../../../src/configuration/databases/redis');

const exit = require('../../../../src/configuration/exit');
const MongoDB = require('../../../../src/configuration/databases/mongodb');
const RedisDB = require('../../../../src/configuration/databases/redis');

describe('exit tests', () => {
    beforeEach(() => {
        process.removeAllListeners();
    });

    afterAll(() => {
        process.removeAllListeners();
    });

    it('should shutdown graceful SIGTERM', async done => {
        const close = jest.fn().mockImplementation(cb => cb());
        const server = {
            close,
        };
        const mockExit = jest.spyOn(process, 'exit').mockImplementation(number => number);

        MongoDB.disconnect.mockImplementation(() => {});
        RedisDB.disconnect.mockImplementation(() => {});

        exit(server);

        process.emit('SIGTERM');

        expect(close).toHaveBeenCalledTimes(1);
        expect(MongoDB.disconnect).toHaveBeenCalledTimes(1);
        expect(RedisDB.disconnect).toHaveBeenCalledTimes(1);

        // expect(mockExit).toHaveBeenCalledTimes(1);

        done();
    });

    it('should shutdown graceful SIGINT', async done => {
        const close = jest.fn().mockImplementation(cb => cb());
        const server = {
            close,
        };
        const mockExit = jest.spyOn(process, 'exit').mockImplementation(number => number);

        MongoDB.disconnect.mockImplementation(() => {});
        RedisDB.disconnect.mockImplementation(() => {});

        exit(server);

        process.emit('SIGINT');

        expect(close).toHaveBeenCalledTimes(1);
        expect(MongoDB.disconnect).toHaveBeenCalledTimes(1);
        expect(RedisDB.disconnect).toHaveBeenCalledTimes(1);

        // expect(mockExit).toHaveBeenCalledTimes(1);

        done();
    });
});
