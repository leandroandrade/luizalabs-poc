const express = require('express');
require('express-async-errors');

const index = express();

const setApp = require('../setup');
const setHanders = require('../handlers');
const setRouters = require('../routes');
const setDocumentation = require('../documentation');

setApp(index);
setRouters(index);
setHanders(index);
setDocumentation(index);

module.exports = index;
