import { decodeToken } from './verifications/verifyToken';
import Util from '../helpers/utils';
import userService from '../services/userService';
import tokenService from '../services/tokenService';

const util = new Util();

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    await decodeToken(token);
    const loggedIn = await tokenService.findByToken({ token });
    if (!loggedIn) {
      const Error = 'Login first To continue';
      util.setError(401, Error);
      return util.send(res);
    }
    const {
      id, firstName, lastName, email, phoneNumber, RoleId, profilePicture, campanyName, isVerified, status, category,
    } = loggedIn.User;
    req.userInfo = {
      id, firstName, lastName, email, phoneNumber, RoleId, profilePicture, campanyName, isVerified, status, category,
    };
    next();
  } catch (error) {
    console.log(error);
    util.setError(500, error);
    return util.send(res);
  }
};

export const allowedRoles = (roles) => {
  const allow = (req, res, next) => {
    try {
      const { RoleId } = req.userInfo;
      console.log(RoleId);
      if (roles.indexOf(RoleId) < 0) {
        util.setError(403, 'You are not allowed to permform this task');
        return util.send(res);
      }
      next();
    } catch (error) {
      console.log(error);
      util.setError(500, error);
      return util.send(res);
    }
  };
  return allow;
};

export const checkBlocked = (req, res, next) => {
  const { status } = req.userInfo;
  try {
    if (status === 'broked') {
      util.setError(403, 'Your account was Blocked, Please Contact Adiministrator.');
      return util.send(res);
    }
    next();
  } catch (error) {
    util.setError(500, error.message);
    return util.send(res);
  }
};
