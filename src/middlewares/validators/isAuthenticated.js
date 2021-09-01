import Util from '../../helpers/utils';
import { decodeToken } from '../verifications/verifyToken';
import userServices from '../../services/userService';
import tokenService from '../../services/tokenService';

const util = new Util();

export default class Auth {
  static async isTokenExist(req, res, next) {
    try {
      if (!req.headers.authorization) {
        util.setError(401, 'Token not found');
        return util.send(res);
      }
      return next();
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async isTokenValid(req, res, next) {
    try {
      const authToken = req.headers.authorization;
      const { email } = await decodeToken(authToken);
      if (!email) {
        util.setError(401, 'Invalid Token');
        return util.send(res);
      }
      res.email = email;
      return next();
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async isUserExists(req, res, next) {
    try {
      // const user = await userServices.findByEmail(res.email);
      const authToken = req.headers.authorization;
      const authUser = await tokenService.findByToken({ token: authToken });
      if (!authUser) {
        util.setError(401, 'user not logged in');
        return util.send(res);
      }
      if (authUser.User == null) {
        util.setError(400, 'user not found');
        return util.send(res);
      }
      res.token = authUser;
      return next();
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }
}
