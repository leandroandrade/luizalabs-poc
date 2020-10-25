const { MongoClient } = require('mongodb');

const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const state = {
    db: null,
    client: null,
};

exports.connect = async () => {
    const client = await MongoClient.connect(process.env.MONGODB_URL, mongoOptions);

    state.client = client;
    state.db = client.db(process.env.MONGODB_DB);
};

exports.getCollection = name => state.db.collection(name);
