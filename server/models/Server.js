const express = require('express');
const path = require('path');
const clc = require('cli-color');
const morgan = require('morgan');
const cors = require('cors');
const { dbConnection } = require('../database/config');

require('dotenv').config();

class Server {
  constructor() {
    this.isDev = process.env.NODE_ENV !== 'production';
    this.PORT = process.env.PORT || 5000;
    this.app = express();
    dbConnection();
    this.middlewares();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: process.env.ORIGIN,
        optionsSuccessStatus: 200,
      })
    );

    if (this.isDev) this.app.use(morgan('dev'));

    this.app.use(
      express.static(path.resolve(__dirname, '../../react-ui/build'))
    );

    this.app.get('/api', function (req, res) {
      res.json({ ok: true });
    });

    this.app.get('*', function (req, res) {
      res.sendFile(
        path.resolve(__dirname, '../../react-ui/build', 'index.html')
      );
    });
  }

  execute() {
    this.app.listen(this.PORT, () => {
      if (this.isDev) {
        process.stdout.write(clc.erase.screen);
        process.stdout.write(clc.move.top);
      }

      console.log('Server Online');
      console.log(`Puerto ${this.PORT}`);
    });
  }
}

module.exports = Server;
