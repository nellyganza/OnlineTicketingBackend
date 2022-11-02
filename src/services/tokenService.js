import models from '../models';

const { Token, Users } = models;
/**
 * @exports
 * @class Tokenervice
 */
class Tokenervice {
  static createToken(newToken) {
    return Token.create(newToken);
  }

  static updateAtt(set, prop) {
    return Token.update(set, {
      returning: true,
      where: prop,
    });
  }

  static findByToken(prop) {
    return Token.findOne({
      where: prop,
      include: [{
        model: Users,
      }],
    });
  }

  static deleteToken(token) {
    return token.destroy();
  }
}
export default Tokenervice;
