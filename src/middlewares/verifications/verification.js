import { getJwtToken } from '../../helpers/tokenGenerator';
import Util from '../../helpers/utils';
import { tokenValid } from '../../helpers/validationSchemas/userValidationSchemas/validateUser';
import userService from '../../services/userService';
import { decodeToken } from './verifyToken';

const util = new Util();
export default class verifications {
  static async email(req, res, next) {
    try {
      const user = await userService.findByEmail(req.body.email);
      if (user) {
        const payload = {
          userId: user.id,
          email: user.email,
          resetpassword: true,
        };
        const token = await getJwtToken(payload, '5m');
        res.token = token;
        res.userInfo = user;
        next();
      } else {
        util.setError(404, 'User with that  email doesn\'t exist');
        return util.send(res);
      }
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async tokenValid(req, res, next) {
    try {
      const decoded = await decodeToken(req.params.token);
      const { error } = tokenValid.validate(decoded);
      if (error) {
        const Error = 'Invalid link';
        util.setError(400, Error);
        return util.send(res);
      }
      res.info = decoded;
      next();
    } catch (error) {
      util.setError(500, error.message.replace('jwt expired', 'Link Expired'));
      return util.send(res);
    }
  }
}
