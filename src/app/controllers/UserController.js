import * as Yup from 'yup'; // validacao de campos
import User from '../models/User';

class UserController {
  async cadastrar(req, res) {
    // verificacao de dados
    // const schema = Yup.object().shape({
    //   name: Yup.string().required(),
    //   email: Yup.string()
    //     .required()
    //     .email(),
    //   password: Yup.required(),
    // });

    // if (!(await schema.isValid(req.body))) {
    //  return res.status(400).json({ error: 'Campos Invalidos' });
    // }

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
}

export default new UserController();
