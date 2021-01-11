const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoMemory = new MongoMemoryServer();

const mongodb = require('../../../../../src/configuration/databases/mongodb');
const app = require('../../../../../src/configuration/app');

describe('Atualiza cliente test', () => {
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
        await mongodb.collection('clientes').deleteMany({});
    });

    it('deve alterar os dados do cliente', async done => {
        await mongodb
            .collection('clientes')
            .insertOne({ id: 'abc', nome: 'Fulano Silva', email: 'fulano@email.com' });

        const cliente = await mongodb.collection('clientes').findOne({ email: 'fulano@email.com' });

        const { id } = cliente;

        const { status } = await request(app)
            .put(`/api/v1/clientes/${id}`)
            .set('Authorization', `${process.env.TOKEN_TEST}`)
            .send({ nome: 'Novo nome' });

        expect(status).toBe(204);

        const novoCliente = await mongodb
            .collection('clientes')
            .findOne({ email: 'fulano@email.com' });

        expect(novoCliente.nome).toBe('Novo nome');

        done();
    });

    it('deve retornar 404 caso o cliente nao exista', async done => {
        const { status } = await request(app)
            .put(`/api/v1/clientes/1`)
            .set('Authorization', `${process.env.TOKEN_TEST}`)
            .send({ nome: 'Novo nome' });

        expect(status).toBe(404);

        done();
    });

    it('deve retornar 401 caso o token de autenticacao na seja informado', async done => {
        const { status } = await request(app)
            .put(`/api/v1/clientes/mockID`)
            .send({ nome: 'Novo nome' });

        expect(status).toBe(401);

        done();
    });
});
