import multer from 'multer';
import crypto from 'crypto';

import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'temp', 'uploads'),
    filename: (req, file, callback) => {
      // gerando um hex para o nome do arquivo + a extensao
      crypto.randomBytes(16, (err, raw) => {
        if (err) {
          return callback(err);
        }
        return callback(null, raw.toString('hex') + extname(file.originalname));
      });
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png'];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Tipo de arquivo invalido'));
    }
  },
};
