// import * as Yup from 'yup'; // validacao de campos
// import User from '../models/User';

class UserController {
  async cadastrar(req, res) {
    // const userExists = await User.findOne({ where: { email: req.body.email } });

    // if (userExists) {
    //   return res.status(400).json({ error: 'Usuario ja existe no sistema' });
    // }

    // const user = await User.create(req.body);

    return res.json(req.body);
  }
}

export default new UserController();
