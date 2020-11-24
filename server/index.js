const express = require('express');
const path = require('path');
const clc = require('cli-color');
const morgan = require('morgan');
const cors = require('cors');
const { dbConnection } = require('./database/config');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

require('dotenv').config();

const app = express();
dbConnection();

app.use(express.json());
app.use(
  cors({
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);

if (isDev) {
  app.use(morgan('dev'));
}

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// Answer API requests.
app.get('/api', function (req, res) {
  res.json({ ok: true });
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

app.listen(PORT, () => {
  if (isDev) {
    process.stdout.write(clc.erase.screen);
    process.stdout.write(clc.move.top);
  }

  console.log('Server Online');
  console.log(`Puerto ${process.env.PORT || '8080'}`);
});
