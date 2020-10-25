const express = require('express');
require('express-async-errors');

const cors = require('cors');
const helmet = require('helmet');

const app = express();

const setHanders = require('./configuration/handlers');
const setRouters = require('./configuration/routes');

app.use(cors());
app.use(helmet());
app.use(express.json());

setRouters(app);
setHanders(app);

module.exports = app;
