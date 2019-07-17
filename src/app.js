import express from 'express';
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
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
