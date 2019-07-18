import jwt from 'jsonwebtoken';
import User from '../models/User';

import authConfig from '../../config/auth';

class SessionController {
  async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Usuario nao existe' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ error: 'Senha errada' });
    }

    const { id, name } = req.body;

    return res.json({
      user: { id, name, email },
      token: jwt.sign({ id }, authConfig.secret, {
        // passar o id no token e a secret basica criada
        expiresIn: authConfig.expiresIn, // tempo de expiracao do token
      }),
    });
  }
}
export default new SessionController();
