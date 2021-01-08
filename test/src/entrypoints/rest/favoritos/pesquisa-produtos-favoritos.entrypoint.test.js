const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoMemory = new MongoMemoryServer();

const mongodb = require('../../../../../src/configuration/databases/mongodb');
const app = require('../../../../../src/app');

describe('Pesquisa produtos favoritos test', () => {
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
        await mongodb.getCollection('favoritos').deleteMany({});
    });

    it('deve retornar 401 caso o token de autenticacao na seja informado', async done => {
        const idCliente = 'abc123';
        const { status } = await request(app).get(
            `/api/v1/clientes/${idCliente}/favoritos/produtos`
        );

        expect(status).toBe(401);
        done();
    });

    it('deve retornar os produtos favoritos do cliente', async done => {
        const idCliente = 'abc123';

        const mockProduto = {
            idCliente,
            price: 39.9,
            image:
                'http://challenge-api.luizalabs.com/images/0e062300-ac6f-ba7a-18c0-6fbed3af0498.jpg',
            id: '0e062300-ac6f-ba7a-18c0-6fbed3af0498',
            title: 'Película Protetora para iPhone 6',
        };
        await mongodb.getCollection('favoritos').insertOne(mockProduto);

        const { status, body } = await request(app)
            .get(`/api/v1/clientes/${idCliente}/favoritos/produtos`)
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

        expect(first.price).toBe(mockProduto.price);
        expect(first.image).toBe(mockProduto.image);
        expect(first.id).toBe(mockProduto.id);
        expect(first.title).toBe(mockProduto.title);

        done();
    });

    it('deve retornar vazio caso nao existam produtos nos favoritos do cliente', async done => {
        const idCliente = 'abc123';

        const { status, body } = await request(app)
            .get(`/api/v1/clientes/${idCliente}/favoritos/produtos`)
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

    it('deve retornar 400 caso a pagina seja invalida', async done => {
        const idCliente = 'abc123';
        const { status } = await request(app)
            .get(
                `/api/v1/clientes/${idCliente}/favoritos/produtos?pagina=invalid&registrosPorPagina=1`
            )
            .set('Authorization', `${process.env.TOKEN_TEST}`);

        expect(status).toBe(400);

        done();
    });

    it('deve retornar 400 caso o registrosPorPagina seja invalido', async done => {
        const idCliente = 'abc123';
        const { status } = await request(app)
            .get(
                `/api/v1/clientes/${idCliente}/favoritos/produtos?pagina=invalid&registrosPorPagina=1`
            )
            .set('Authorization', `${process.env.TOKEN_TEST}`);

        expect(status).toBe(400);

        done();
    });
});
