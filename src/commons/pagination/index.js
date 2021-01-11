const ResultadoPaginado = require('./result-pagination');

const naoExistemRegistros = registros => registros <= 0;
const isPaginaMaiorTotalDePaginas = (pagina, totalPaginas) => pagina > totalPaginas;

module.exports = { ResultadoPaginado, naoExistemRegistros, isPaginaMaiorTotalDePaginas };
