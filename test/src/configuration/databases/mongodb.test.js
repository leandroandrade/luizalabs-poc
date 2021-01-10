const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoMemory = new MongoMemoryServer();

const mongodb = require('../../../../src/configuration/databases/mongodb');

describe('mongodb test', () => {
    beforeAll(async () => {
        process.env.MONGODB_URL = await mongoMemory.getUri(true);
        process.env.MONGODB_DB = 'luizalabs';
    });

    it('deve validar a conexao com o MongoDB', async done => {
        await mongodb.connect();
        await mongodb.collection('mock').insertOne({ id: 1, value: 'mock' });

        const mock = await mongodb.collection('mock').findOne({ id: 1 });
        expect(mock).not.toBeNull();
        expect(mock).not.toBeUndefined();

        expect(mock.id).toBe(1);
        expect(mock.value).toBe('mock');
        done();
    });
});
