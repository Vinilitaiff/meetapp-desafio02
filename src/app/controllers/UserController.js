import * as Yup from 'yup'; // validacao de campos
import User from '../models/User';

class UserController {
  async cadastrar(req, res) {
    // verificacao de dados
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
      password: Yup.required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Campos Invalidos' });
    }

    const existeUser = await User.findOne({ where: { email: req.body.email } });

    if (existeUser) {
      return res.status(400).json({ error: 'Usuario ja existe no sistema' });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async editar(req, res) {
    // validar campos com yup -- issue

    const { email, oldPassword } = req.body;

    // getbean || userId vem do middleware pelo token
    const user = await User.findByPk(req.userId);

    // check pra nao editar o email com um email ja existente
    if (email !== user.email) {
      const existeUser = await User.findOne({ where: { email } });

      if (existeUser) {
        return res.status(400).json({ error: 'Usuario ja existe no sistema' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Senha errada' });
    }

    const { id, name } = await User.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
