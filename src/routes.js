import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.cadastrar);
routes.post('/sessions', SessionController.login);

// so vai valer para as rotas apos
routes.use(authMiddleware);

routes.put('/users', UserController.editar);

routes.post(
  '/files',
  upload.single('file'), // middleware upload um arquivo por vez e nome do campo da req
  FileController.incluir
);

export default routes;
