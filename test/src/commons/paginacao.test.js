const paginacao = require('../../../src/commons/pagination/paginacao');

describe('paginacao test', () => {
    it('deve retornar o objeto padrao de paginacao', async done => {
        const result = paginacao.criaObjetoPaginacao();
        const { paginacao: dadosPaginacao, resultado } = result;

        const { totalRegistros, numeroPagina, totalPaginas, tamanhoPagina } = dadosPaginacao;
        expect(totalRegistros).toBe(0);
        expect(numeroPagina).toBe(0);
        expect(totalPaginas).toBe(0);
        expect(tamanhoPagina).toBe(0);

        expect(resultado.length).toBe(0);

        done();
    });

    it('deve retornar uma objeto de paginacao preenchido', async done => {
        const expectTotalRegistros = 1;
        const expectNumeroPagina = 1;
        const expectTotalPaginas = 10;
        const expectTamanhoPagina = 10;
        const expectResultado = [{ id: 1, value: 'mock' }];

        const result = paginacao.criaObjetoPaginacao(
            expectTotalRegistros,
            expectNumeroPagina,
            expectTotalPaginas,
            expectTamanhoPagina,
            expectResultado
        );
        const { paginacao: dadosPaginacao, resultado } = result;

        const { totalRegistros, numeroPagina, totalPaginas, tamanhoPagina } = dadosPaginacao;
        expect(totalRegistros).toBe(expectTotalRegistros);
        expect(numeroPagina).toBe(expectNumeroPagina);
        expect(totalPaginas).toBe(expectTotalPaginas);
        expect(tamanhoPagina).toBe(expectTamanhoPagina);

        const [first] = resultado;

        expect(first.id).toBe(1);
        expect(first.value).toBe('mock');

        done();
    });

    it('deve retornar true caso a pagina seja uma letra', async done => {
        const result = paginacao.isPaginaInvalida('a');
        expect(result).toBeTruthy();

        done();
    });

    it('deve retornar false caso a pagina seja um numero string', async done => {
        const result = paginacao.isPaginaInvalida('1');
        expect(result).toBeFalsy();

        done();
    });

    it('deve retornar false caso a pagina seja um numero number', async done => {
        const result = paginacao.isPaginaInvalida(1);
        expect(result).toBeFalsy();

        done();
    });

    it('deve retornar true caso a pagina nao seja informada', async done => {
        const result = paginacao.isPaginaInvalida();
        expect(result).toBeTruthy();

        done();
    });
});
