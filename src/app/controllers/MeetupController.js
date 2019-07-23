import { isBefore, startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import * as yup from 'yup';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  async listar(req, res) {
    const page = req.query.page > 0 ? req.query.page : 1;
    const where = {};

    if (req.query.data) {
      const searchData = parseISO(req.query.data);

      where.data = {
        [Op.between]: [startOfDay(searchData), endOfDay(searchData)],
      };
    }

    const meetups = await Meetup.findAll({
      where,
      limit: 10,
      offset: 10 * page - 10,
      attributes: ['id', 'titulo', 'descricao', 'localizacao', 'data'],
      include: [
        {
          model: File,
          attributes: ['id', 'path', 'url'],
        },
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(meetups);
  }

  async incluir(req, res) {
    const schema = yup.object().shape({
      titulo: yup.string().required(),
      file_id: yup.number().required(),
      descricao: yup.string().required(),
      localizacao: yup.string().required(),
      data: yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Campos Invalidos' });
    }

    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({
        error: 'Não é possível cadastrar meetups com datas que já passaram.',
      });
    }

    const user_id = req.userId;

    const meetup = await Meetup.create({ ...req.body, user_id });

    return res.json(meetup);
  }

  async editar(req, res) {
    const schema = yup.object().shape({
      titulo: yup.string().required(),
      file_id: yup.number().required(),
      descricao: yup.string().required(),
      localizacao: yup.string().required(),
      data: yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Campos Invalidos' });
    }

    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== req.userId) {
      return res.status(400).json({
        error: 'Não é organizador desse Meetup.',
      });
    }

    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({
        error: 'Não é possível cadastrar meetups com datas que já passaram.',
      });
    }

    if (meetup.past) {
      return res.status(400).json({
        error: 'Não é possível editar meetups passados.',
      });
    }

    await meetup.update(req.body);

    return res.json(meetup);
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== req.userId) {
      return res.status(400).json({
        error: 'Não é organizador desse Meetup.',
      });
    }

    if (meetup.past) {
      return res.status(400).json({
        error: 'Não é possível remover meetups passados.',
      });
    }

    await meetup.destroy();

    return res.send();
  }
}

export default new MeetupController();
