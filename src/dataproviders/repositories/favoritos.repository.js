const { collection } = require('../../configuration/databases/mongodb');
const { ResultadoPaginado } = require('../../commons/pagination');

const naoExistemFavoritos = totalClientes => totalClientes <= 0;
const isPaginaMaiorTotalDePaginas = (pagina, totalPaginas) => pagina > totalPaginas;

exports.registraProduto = favorito => collection('favoritos').insertOne(favorito);

exports.isProdutoRegistrado = async ({ idCliente, idProduto }) => {
    const total = await collection('favoritos').countDocuments({ idCliente, id: idProduto });
    return total > 0;
};

exports.porCliente = async ({ idCliente, pagina, registrosPorPagina }) => {
    const filter = {
        idCliente,
    };

    const totalFavoritos = await collection('favoritos').countDocuments(filter);
    if (naoExistemFavoritos(totalFavoritos)) {
        return new ResultadoPaginado();
    }

    const totalPaginas = Math.ceil(totalFavoritos / registrosPorPagina);
    if (isPaginaMaiorTotalDePaginas(pagina, totalPaginas)) {
        return new ResultadoPaginado();
    }

    const projection = {
        _id: 0,
        idCliente: 0,
    };

    const favoritos = await collection('favoritos')
        .aggregate([
            { $match: filter },
            { $project: projection },
            { $skip: Number(registrosPorPagina * (pagina - 1)) },
            { $limit: Number(registrosPorPagina) },
            { $sort: { dataInclusao: 1 } },
        ])
        .toArray();

    return new ResultadoPaginado({
        totalRegistros: totalFavoritos,
        numeroPagina: +pagina,
        totalPaginas,
        resultado: favoritos,
    });
};

exports.removePorCliente = idCliente => collection('favoritos').deleteOne({ idCliente });

exports.remove = ({ idCliente, idProduto }) =>
    collection('favoritos').deleteOne({
        idCliente,
        id: idProduto,
    });
