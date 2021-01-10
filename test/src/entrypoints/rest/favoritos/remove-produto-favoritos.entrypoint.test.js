const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoMemory = new MongoMemoryServer();

const mongodb = require('../../../../../src/configuration/databases/mongodb');
const app = require('../../../../../src/app');

describe('Remove produto favoritos test', () => {
    beforeAll(async () => {
        process.env.MONGODB_URL = await mongoMemory.getUri(true);
        process.env.MONGODB_DB = 'luizalabs';

        await mongodb.connect();

        const { body } = await request(app)
            .post('/api/v1/auth')
            .send({ username: 'luizalabs', password: 'luizalabs', role: 'ADMIN' });

        const { token } = body;
        process.env.TOKEN_TEST = token;
    });

    beforeEach(async () => {
        await mongodb.collection('favoritos').deleteMany({});
    });

    it('deve retornar 401 caso o token de autenticacao nao seja informado', async done => {
        const idCliente = 'abc123';
        const idProduto = '0e062300-ac6f-ba7a-18c0-6fbed3af0498';
        const { status } = await request(app).delete(
            `/api/v1/clientes/${idCliente}/produtos/${idProduto}/favoritos`
        );

        expect(status).toBe(401);
        done();
    });

    it('deve remover o produto da lista de favoritos', async done => {
        const idCliente = 'abc123';
        const idProduto = '0e062300-ac6f-ba7a-18c0-6fbed3af0498';

        const produto = {
            idCliente,
            price: 39.9,
            image:
                'http://challenge-api.luizalabs.com/images/0e062300-ac6f-ba7a-18c0-6fbed3af0498.jpg',
            id: idProduto,
            title: 'Película Protetora para iPhone 6',
        };
        await mongodb.collection('favoritos').insertOne(produto);

        const { status } = await request(app)
            .delete(`/api/v1/clientes/${idCliente}/produtos/${idProduto}/favoritos`)
            .set('Authorization', `${process.env.TOKEN_TEST}`);

        expect(status).toBe(204);
        done();
    });
});
