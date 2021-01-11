const { collection } = require('../../configuration/databases/mongodb');
const { criaObjetoPaginacao } = require('../../commons/pagination/paginacao');

const naoExistemClientes = totalClientes => totalClientes <= 0;
const isPaginaMaiorTotalDePaginas = (pagina, totalPaginas) => pagina > totalPaginas;

exports.todos = async ({ pagina, registrosPorPagina }) => {
    const totalClientes = await collection('clientes').countDocuments();

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

    const clientes = await collection('clientes')
        .aggregate([
            { $project: projection },
            { $skip: Number(registrosPorPagina * (pagina - 1)) },
            { $limit: Number(registrosPorPagina) },
            { $sort: { dataInclusao: 1 } },
        ])
        .toArray();

    return criaObjetoPaginacao(totalClientes, +pagina, totalPaginas, clientes.length, clientes);
};

exports.porID = id => collection('clientes').findOne({ id }, { projection: { _id: 0 } });

exports.isNaoCadastrado = async id => {
    const total = await collection('clientes').countDocuments({ id });
    return total <= 0;
};

exports.isExiste = async email => {
    const total = await collection('clientes').countDocuments({ email });
    return total > 0;
};

exports.registra = cliente => collection('clientes').insertOne(cliente);

exports.atualiza = ({ id, nome }) => collection('clientes').updateOne({ id }, { $set: { nome } });

exports.remove = id => collection('clientes').deleteOne({ id });
