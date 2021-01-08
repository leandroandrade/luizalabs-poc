const express = require('express');
require('express-async-errors');

const app = express();

const setApp = require('./configuration/app');
const setHanders = require('./configuration/handlers');
const setRouters = require('./configuration/routes');
const setDocumentation = require('./configuration/documentation');

setApp(app);
setRouters(app);
setHanders(app);
setDocumentation(app);

module.exports = app;
