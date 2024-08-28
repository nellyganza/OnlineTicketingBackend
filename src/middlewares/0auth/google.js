/* eslint-disable consistent-return */
import { pick } from 'lodash';
import usersController from '../../controllers/usersController';
import AuthTokenHelper from '../../helpers/AuthTokenHelper';
import Util from '../../helpers/utils';
import tokenService from '../../services/tokenService';
import userService from '../../services/userService';

const util = new Util();
const googleAuth = async (req, res) => {
  const message = 'manually';
  const { email } = req.user;
  const currentUser = await userService.findByEmail(email);
  if (currentUser !== null) {
    if (currentUser.password !== null) {
      return res.redirect(`${process.env.FRONT_END_URL}/socialAuth/failure/${message}`);
    }
    if (currentUser.status === 'broked') {
      util.setError(403, 'Your account was Blocked, Please Contact Adiministrator.');
      return util.send(res);
    }

    const displayData = pick(currentUser.dataValues, ['id', 'email', 'firstName', 'lastName', 'RoleId', 'isVerified', 'status', 'phoneNumber', 'category', 'campanyName', 'profilePicture', 'Role', 'share', 'socialId', 'provider']);
    const authToken = AuthTokenHelper.generateToken(displayData);
    userService.updateAtt({ authToken }, { id: displayData.id });
    await tokenService.createToken({ token: authToken, userId: displayData.id });
    const encodedToken = Buffer.from(authToken).toString('base64');
    return res.redirect(`${process.env.FRONT_END_URL}/socialAuth/success/${encodedToken}`);
  }
  if (currentUser === null) {
    return usersController.socialSignup(req.user, res);
  }
};

export default googleAuth;
