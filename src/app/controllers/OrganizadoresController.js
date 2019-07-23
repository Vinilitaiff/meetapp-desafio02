import Meetup from '../models/Meetup';

class OrganizadoresController {
  async listar(req, res) {
    const meetups = await Meetup.findAll({ where: { user_id: req.userId } });

    return res.json(meetups);
  }
}

export default new OrganizadoresController();
