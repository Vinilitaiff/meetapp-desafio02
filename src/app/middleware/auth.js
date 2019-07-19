import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: 'Token não informado' });
  }

  const [bearer, token] = authToken.split(' ');
  if (!token) {
    return res.status(401).json({ error: 'Token não informado' });
  }
  // console.log(token);
  try {
    // cosnt = decoded // padrao
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // console.log(decoded.id);
    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalido' });
  }
};
