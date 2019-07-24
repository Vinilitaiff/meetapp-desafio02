import 'dotenv/config';

import express from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

import './database'; // importante || erro: Cannot read property 'length' of undefined
import sentryConfig from './config/sentry';
import routes from './routes';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.server.use(Sentry.Handlers.requestHandler());
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // para receber req em formato de json
    this.server.use(express.json());
    // servir arquivos estaticos
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}
export default new App();
