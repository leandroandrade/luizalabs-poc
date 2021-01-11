const ResultadoPaginado = require('./result-pagination');

const naoExistemRegistros = registros => registros <= 0;
const isPaginaMaiorTotalDePaginas = (pagina, totalPaginas) => pagina > totalPaginas;
const isPaginaInvalida = pagina => {
    if (!pagina) return true;
    if (pagina.toUpperCase() === pagina.toLowerCase()) return true;

    return false;
};

module.exports = {
    ResultadoPaginado,
    naoExistemRegistros,
    isPaginaMaiorTotalDePaginas,
    isPaginaInvalida,
};
