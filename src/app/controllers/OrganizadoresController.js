import Meetup from '../models/Meetup';

class OrganizadoresController {
  // Crie uma rota para listar os meetups em que o usuário logado está inscrito.
  async listar(req, res) {
    const meetups = await Meetup.findAll({ where: { user_id: req.userId } });

    return res.json(meetups);
  }
}

export default new OrganizadoresController();
