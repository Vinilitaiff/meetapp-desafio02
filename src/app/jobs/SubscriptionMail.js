import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { meetup, user } = data;

    await Mail.sendMail({
      to: `${meetup.User.name} <${meetup.User.email}>`,
      subject: `[${meetup.titulo}] Nova inscrição`,
      template: 'subscription',
      context: {
        organizador: meetup.User.name,
        meetup: meetup.titulo,
        user: user.name,
        email: user.email,
      },
    });
  }
}

export default new SubscriptionMail();
