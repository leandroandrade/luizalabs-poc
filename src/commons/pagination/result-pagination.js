module.exports = class ResultadoPaginado {
    constructor(param = {}) {
        const { totalRegistros = 0, numeroPagina = 0, totalPaginas = 0, resultado = [] } = param;
        this.paginacao = {
            totalRegistros,
            numeroPagina,
            totalPaginas,
            tamanhoPagina: resultado.length,
        };
        this.resultado = resultado;
    }
};
