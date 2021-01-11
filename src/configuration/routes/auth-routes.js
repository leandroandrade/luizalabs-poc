const { geraTokenAcesso } = require('../../entrypoints/rest/auth/auth.entrypoint');

module.exports = router => {
    router.post('/auth', geraTokenAcesso);
};
