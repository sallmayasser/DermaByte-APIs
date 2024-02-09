const express = require('express');
const morgan = require('morgan');

const app = express();

// 1) MIDDLEWARES
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 3)Mount ROUTES




module.exports = app;
