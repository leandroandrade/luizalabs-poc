const express = require('express');
require('express-async-errors');

const app = express();

const setApp = require('../setup');
const setHanders = require('../handlers');
const setRouters = require('../routes');
const setDocumentation = require('../documentation');

setApp(app);
setRouters(app);
setHanders(app);
setDocumentation(app);

module.exports = app;
