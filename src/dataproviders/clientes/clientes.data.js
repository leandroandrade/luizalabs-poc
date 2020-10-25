const { getCollection } = require('../../configuration/databases/mongodb');
const { criaObjetoPaginacao } = require('../../commons/paginacao');

const naoExistemClientes = totalClientes => totalClientes <= 0;
const isPaginaMaiorTotalDePaginas = (pagina, totalPaginas) => pagina > totalPaginas;

exports.todos = async ({ pagina, registrosPorPagina }) => {
    const totalClientes = await getCollection('clientes').countDocuments();

    if (naoExistemClientes(totalClientes)) {
        return criaObjetoPaginacao();
    }

    const totalPaginas = Math.ceil(totalClientes / registrosPorPagina);
    if (isPaginaMaiorTotalDePaginas(pagina, totalPaginas)) {
        return criaObjetoPaginacao();
    }

    const projection = {
        _id: 0,
    };

    const clientes = await getCollection('clientes')
        .aggregate([
            { $project: projection },
            { $skip: Number(registrosPorPagina * (pagina - 1)) },
            { $limit: Number(registrosPorPagina) },
            { $sort: { dataInclusao: 1 } },
        ])
        .toArray();

    return criaObjetoPaginacao(totalClientes, +pagina, totalPaginas, clientes.length, clientes);
};

exports.porID = id => getCollection('clientes').findOne({ id }, { projection: { _id: 0 } });

exports.isNaoCadastrado = async id => {
    const total = await getCollection('clientes').countDocuments({ id });
    return total <= 0;
};

exports.isExiste = async email => {
    const total = await getCollection('clientes').countDocuments({ email });
    return total > 0;
};

exports.registra = cliente => getCollection('clientes').insertOne(cliente);

exports.atualiza = ({ id, nome }) =>
    getCollection('clientes').updateOne({ id }, { $set: { nome } });

exports.remove = id => getCollection('clientes').deleteOne({ id });
