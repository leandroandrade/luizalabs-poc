const MongoDB = require('../../configuration/databases/mongodb');
const { ResultadoPaginado } = require('../../commons/pagination');

const naoExistemClientes = totalClientes => totalClientes <= 0;
const isPaginaMaiorTotalDePaginas = (pagina, totalPaginas) => pagina > totalPaginas;

exports.todos = async ({ pagina, registrosPorPagina }) => {
    const totalClientes = await MongoDB.collection('clientes').countDocuments();

    if (naoExistemClientes(totalClientes)) {
        return new ResultadoPaginado();
    }

    const totalPaginas = Math.ceil(totalClientes / registrosPorPagina);
    if (isPaginaMaiorTotalDePaginas(pagina, totalPaginas)) {
        return new ResultadoPaginado();
    }

    const projection = {
        _id: 0,
    };

    const clientes = await MongoDB.collection('clientes')
        .aggregate([
            { $project: projection },
            { $skip: Number(registrosPorPagina * (pagina - 1)) },
            { $limit: Number(registrosPorPagina) },
            { $sort: { dataInclusao: 1 } },
        ])
        .toArray();

    return new ResultadoPaginado({
        totalRegistros: totalClientes,
        numeroPagina: +pagina,
        totalPaginas,
        resultado: clientes,
    });
};

exports.porID = id => MongoDB.collection('clientes').findOne({ id }, { projection: { _id: 0 } });

exports.isNaoCadastrado = async id => {
    const total = await MongoDB.collection('clientes').countDocuments({ id });
    return total <= 0;
};

exports.isExiste = async email => {
    const total = await MongoDB.collection('clientes').countDocuments({ email });
    return total > 0;
};

exports.registra = cliente => MongoDB.collection('clientes').insertOne(cliente);

exports.atualiza = ({ id, nome }) =>
    MongoDB.collection('clientes').updateOne({ id }, { $set: { nome } });

exports.remove = id => MongoDB.collection('clientes').deleteOne({ id });
