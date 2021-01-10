const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoMemory = new MongoMemoryServer();

const mongodb = require('../../../../../src/configuration/databases/mongodb');
const app = require('../../../../../src/app');

describe('Pesquisa clientes test', () => {
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

    it('deve retornar vazio caso na existam clientes', async done => {
        const { status, body } = await request(app)
            .get('/api/v1/clientes')
            .set('Authorization', `${process.env.TOKEN_TEST}`);

        expect(status).toBe(200);
        expect(body).not.toBeNull();
        expect(body).not.toBeUndefined();

        const { resultado: payload } = body;
        const { paginacao, resultado } = payload;

        const { totalRegistros, numeroPagina, totalPaginas, tamanhoPagina } = paginacao;
        expect(totalRegistros).toBe(0);
        expect(numeroPagina).toBe(0);
        expect(totalPaginas).toBe(0);
        expect(tamanhoPagina).toBe(0);

        expect(resultado.length).toBe(0);

        done();
    });

    it('deve retornar a lista de clientes', async done => {
        await mongodb
            .collection('clientes')
            .insertOne({ nome: 'Fulano Silva', email: 'fulano@email.com' });

        const { status, body } = await request(app)
            .get('/api/v1/clientes')
            .set('Authorization', `${process.env.TOKEN_TEST}`);

        expect(status).toBe(200);
        expect(body).not.toBeNull();
        expect(body).not.toBeUndefined();

        const { resultado: payload } = body;
        const { paginacao, resultado } = payload;

        const { totalRegistros, numeroPagina, totalPaginas, tamanhoPagina } = paginacao;
        expect(totalRegistros).toBe(1);
        expect(numeroPagina).toBe(1);
        expect(totalPaginas).toBe(1);
        expect(tamanhoPagina).toBe(1);

        const [first] = resultado;

        expect(first.nome).toBe('Fulano Silva');
        expect(first.email).toBe('fulano@email.com');

        done();
    });

    it('deve retornar 401 caso o token de autenticacao na seja informado', async done => {
        const { status } = await request(app).get('/api/v1/clientes');

        expect(status).toBe(401);
        done();
    });

    it('deve retornar 400 caso a pagina seja invalida', async done => {
        await mongodb
            .collection('clientes')
            .insertOne({ nome: 'Fulano Silva', email: 'fulano@email.com' });

        const { status } = await request(app)
            .get('/api/v1/clientes?pagina=invalid&registrosPorPagina=1')
            .set('Authorization', `${process.env.TOKEN_TEST}`);

        expect(status).toBe(400);

        done();
    });

    it('deve retornar 400 caso o registrosPorPagina seja invalido', async done => {
        await mongodb
            .collection('clientes')
            .insertOne({ nome: 'Fulano Silva', email: 'fulano@email.com' });

        const { status } = await request(app)
            .get('/api/v1/clientes?pagina=1&registrosPorPagina=invalid')
            .set('Authorization', `${process.env.TOKEN_TEST}`);

        expect(status).toBe(400);

        done();
    });
});
