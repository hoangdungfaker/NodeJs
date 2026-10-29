require('dotenv').config()
const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');


const app = express();

// Init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());

// Init database
require('./dbs/init.mongodb');

// Init monitoring
// const {
//     checkOverLoad
// } = require('./helpers/check.connect');

// checkOverLoad();

// Init route
app.use('', require('./router/index'))

module.exports = app;