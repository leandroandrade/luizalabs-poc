const { name, version } = require('../../../package.json');

module.exports = router => {
    router.get('/', (_, res) =>
        res.json({
            name,
            version,
        })
    );
};
