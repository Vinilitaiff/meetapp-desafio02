import express from 'express';
import path from 'path';
import routes from './routes';

import './database'; // importante || erro: Cannot read property 'length' of undefined

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
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
  }
}

export default new App().server;
