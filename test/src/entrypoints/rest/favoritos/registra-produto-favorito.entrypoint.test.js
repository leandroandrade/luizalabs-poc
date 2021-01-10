const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const nock = require('nock');

const mongoMemory = new MongoMemoryServer();

jest.mock('../../../../../src/configuration/databases/redis');
const redis = require('../../../../../src/configuration/databases/redis');

const mongodb = require('../../../../../src/configuration/databases/mongodb');
const app = require('../../../../../src/app');

describe('Registra produto favorito test', () => {
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
        const { status } = await request(app)
            .post(`/api/v1/clientes/${idCliente}/favoritos/produtos`)
            .send({
                price: 39.9,
                image:
                    'http://challenge-api.luizalabs.com/images/0e062300-ac6f-ba7a-18c0-6fbed3af0498.jpg',
                id: '0e062300-ac6f-ba7a-18c0-6fbed3af0498',
                title: 'Película Protetora para iPhone 6',
            });

        expect(status).toBe(401);
        done();
    });

    it('deve retornar erro caso o id do produto nao seja informado', async done => {
        const idCliente = 'abc123';
        const { status } = await request(app)
            .post(`/api/v1/clientes/${idCliente}/favoritos/produtos`)
            .set('Authorization', `${process.env.TOKEN_TEST}`)
            .send({
                price: 39.9,
                image:
                    'http://challenge-api.luizalabs.com/images/0e062300-ac6f-ba7a-18c0-6fbed3af0498.jpg',
                title: 'Película Protetora para iPhone 6',
            });

        expect(status).toBe(400);
        done();
    });

    it('deve retornar erro caso o id do produto ja esteja registrado como favorito', async done => {
        const idCliente = 'abc123';
        const idProduto = '0e062300-ac6f-ba7a-18c0-6fbed3af0498';
        const produto = {
            price: 39.9,
            image:
                'http://challenge-api.luizalabs.com/images/0e062300-ac6f-ba7a-18c0-6fbed3af0498.jpg',
            id: idProduto,
            title: 'Película Protetora para iPhone 6',
        };

        await mongodb.collection('favoritos').insertOne({ ...produto, idCliente });

        const { status } = await request(app)
            .post(`/api/v1/clientes/${idCliente}/favoritos/produtos`)
            .set('Authorization', `${process.env.TOKEN_TEST}`)
            .send(produto);

        expect(status).toBe(400);
        done();
    });

    it('deve retornar erro caso o produto nao exista na API de produtos', async done => {
        const idProduto = '0e062300-ac6f-ba7a-18c0-6fbed3af0498';
        nock(`http://challenge-api.luizalabs.com/api/product/${idProduto}/`).get('/').reply(404);

        const idCliente = 'abc123';
        const produto = {
            price: 39.9,
            image:
                'http://challenge-api.luizalabs.com/images/0e062300-ac6f-ba7a-18c0-6fbed3af0498.jpg',
            id: idProduto,
            title: 'Película Protetora para iPhone 6',
        };

        const { status } = await request(app)
            .post(`/api/v1/clientes/${idCliente}/favoritos/produtos`)
            .set('Authorization', `${process.env.TOKEN_TEST}`)
            .send(produto);

        expect(status).toBe(404);
        done();
    });

    it('deve registrar o produto como favorito', async done => {
        const idCliente = 'abc123';
        const idProduto = '0e062300-ac6f-ba7a-18c0-6fbed3af0498';
        const produto = {
            price: 39.9,
            image:
                'http://challenge-api.luizalabs.com/images/0e062300-ac6f-ba7a-18c0-6fbed3af0498.jpg',
            id: idProduto,
            title: 'Película Protetora para iPhone 6',
        };
        nock(`http://challenge-api.luizalabs.com/api/product/${idProduto}/`)
            .get('/')
            .reply(200, produto);

        const { status } = await request(app)
            .post(`/api/v1/clientes/${idCliente}/favoritos/produtos`)
            .set('Authorization', `${process.env.TOKEN_TEST}`)
            .send(produto);

        expect(status).toBe(200);
        expect(redis.setCache).toHaveBeenCalledWith(idProduto, produto);

        done();
    });

    it('deve registrar o produto como favorito obtido do cache', async done => {
        const produtoCache =
            '{"price":492.07,"image":"http://challenge-api.luizalabs.com/images/3475ae62-7812-9f46-a228-294f92c8e1db.jpg","brand":"pontto lavabo","id":"3475ae62-7812-9f46-a228-294f92c8e1db","title":"Assento Sanitário Cinza Real Century"}';
        redis.getCache.mockResolvedValue(produtoCache);

        const idCliente = 'abc123';
        const idProduto = '3475ae62-7812-9f46-a228-294f92c8e1db';
        const produto = {
            price: 39.9,
            image:
                'http://challenge-api.luizalabs.com/images/0e062300-ac6f-ba7a-18c0-6fbed3af0498.jpg',
            id: idProduto,
            title: 'Película Protetora para iPhone 6',
        };
        const { status } = await request(app)
            .post(`/api/v1/clientes/${idCliente}/favoritos/produtos`)
            .set('Authorization', `${process.env.TOKEN_TEST}`)
            .send(produto);

        expect(status).toBe(200);
        done();
    });
});
