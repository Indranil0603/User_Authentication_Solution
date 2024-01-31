'use strict';
const { app } = require('./server.js');
const serverlessHttp = require('serverless-http');

//handler for the lambda function using the express app
module.exports.hello = serverlessHttp(app);
