exports.criaObjetoPaginacao = (
    totalRegistros = 0,
    numeroPagina = 0,
    totalPaginas = 0,
    tamanhoPagina = 0,
    resultado = []
) => ({
    paginacao: {
        totalRegistros,
        numeroPagina,
        totalPaginas,
        tamanhoPagina,
    },
    resultado,
});

exports.isPaginaInvalida = pagina => {
    if (!pagina) return true;
    if (isNaN(pagina)) return true;

    return false;
};
