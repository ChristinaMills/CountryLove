const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const errorHandler = require('./utils/error-handler');

app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(bodyParser.json());





app.use(errorHandler());
module.exports = app;