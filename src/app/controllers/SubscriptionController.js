import { Op } from 'sequelize';
import Subscription from '../models/Subscription';
import User from '../models/User';
import Meetup from '../models/Meetup';

import SubscriptionMail from '../jobs/SubscriptionMail';
import Queue from '../../lib/Queue';

class SubscriptionsController {
  async listar(req, res) {
    // Liste apenas meetups que ainda não passaram e ordene meetups mais próximos como primeiros da lista.
    const subscription = await Meetup.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          where: {
            date: {
              // > data atual
              [Op.gt]: new Date(),
            },
          },
          required: true,
        },
      ],
      order: [[Meetup, 'date']],
    });
    return res.json(subscription);
  }

  async incluir(req, res) {
    const user = await User.findByPk(req.userId);
    // param = meetupId
    const meetup = await Meetup.findByPk(req.params.meetupId, {
      include: [User],
    });

    // O usuário deve poder se inscrever em meetups que não organiza.
    if (meetup.user_id === req.userId) {
      return req
        .status(400)
        .json({ error: 'Voce nao pode se inscrever no Meetup que organiza' });
    }

    // O usuário não pode se inscrever em meetups que já aconteceram.
    if (meetup.past) {
      return res.status(400).json({
        error: 'Não é possível remover meetups passados.',
      });
    }

    const checkDate = await Subscription.findOne({
      // O usuário não pode se inscrever no mesmo meetup duas vezes.
      where: { user_id: user.id },
      include: [
        {
          model: Meetup,
          required: true,
          // O usuário não pode se increver em dois meetups que acontecem no mesmo horário.
          where: { data: meetup.data },
        },
      ],
    });
    if (checkDate) {
      return res.status(400).json({
        error: ' Não é possível assinar dois encontros ao mesmo tempo',
      });
    }

    const subscription = await Subscription.create({
      meetup_id: meetup.id,
      user_id: user.id,
    });

    await Queue.add(SubscriptionMail.key, {
      meetup,
      user,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionsController();
