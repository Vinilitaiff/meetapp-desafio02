import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        titulo: Sequelize.STRING,
        descricao: Sequelize.STRING,
        localizacao: Sequelize.STRING,
        data: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Meetup;
