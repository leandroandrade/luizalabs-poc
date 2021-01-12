const { MongoClient } = require('mongodb');
const log = require('../logger');

module.exports = {
    async connect() {
        const client = await MongoClient.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        this.client = client;
        this.db = client.db(process.env.MONGODB_DB);

        log.info('MongoDB connected successful');
    },

    async disconnect() {
        await this.client.close();
        this.client = null;
        this.db = null;
    },

    collection(name) {
        return this.db.collection(name);
    },
};
