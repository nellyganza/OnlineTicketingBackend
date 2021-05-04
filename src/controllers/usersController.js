import bcrypt from 'bcrypt';
import { pick } from 'lodash';
import { sendLink } from '../utils/sendVerificationLink';
import { newJwtToken } from '../helpers/tokenGenerator';
import Util from '../helpers/utils';
import userService from '../services/userService';
import AuthTokenHelper from '../helpers/AuthTokenHelper';
import { nexmo } from '../config/nexmo';
import { sendSMS } from '../helpers/notifications/smsNotification';
import {
  sendPasswordResetLink,
} from '../utils/sendPasswordLInk';
import 'dotenv/config';
import { decodeToken } from '../middlewares/verifications/verifyToken';

const util = new Util();
export default class user {
  static async signupWithEmail(req, res) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: hashedPassword,
      };
      const createdUser = await userService.createuser(newUser);
      return sendLink(res, createdUser);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async socialSignup(userInfo, res) {
    try {
      const {
        given_name, family_name, email, provider, id,
      } = userInfo;
      const userData = {
        firstName: given_name,
        lastName: family_name,
        socialId: id,
        provider,
        email,
        isVerified: true,
      };
      const newUser = await userService.createuser(userData);
      if (newUser) {
        const payload = {
          email: newUser.email,
          id: newUser.id,
          roleId: newUser.roleId,
        };
        const token = await newJwtToken(payload, '1h');
        await userService.updateAtt({ authToken: token }, { id: newUser.id });

        const encodedToken = Buffer.from(token).toString('base64');
        util.setSuccess(200, 'Account Created Success', encodedToken);
        return util.send(res);
        // res.redirect(`${process.env.FRONT_END_URL}/socialAuth/success/${encodedToken}`);
      }
    } catch (error) {
      util.setError(500, 'Failed to create your account');
      return util.send(res);
    }
  }

  static async verifyEmail(req, res) {
    try {
      await userService.updateAtt({
        isVerified: true,
      }, {
        id: res.id,
      });
      const {
        id, isVerified, RoleId, email,
      } = await userService.findById(res.id);
      const token = await newJwtToken({ userId: id, RoleId }, '1h');
      const data = { userId: id, email, token };
      const message = 'your account was verified!';
      util.setSuccess(200, message, data);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { userInfo } = res;
      const { token } = res;
      const sentLink = await sendPasswordResetLink(res, {
        token,
        email: userInfo.email,
        name: userInfo.firstName,
      });
      util.setSuccess(200, sentLink.message, sentLink.data);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message, null);
      return util.send(res);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const email = res.info.email;
      const userId = res.info.userId;
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await userService.updateAtt({ password: hashedPassword }, { id: userId, email });
      util.setError(200, 'password changed! you can now login with new password');
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message, null);
      return util.send(res);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (email === null) {
        util.message = 'Email is Required';
        util.statusCode = 400;
        return util.send(res);
      }
      if (password === null) {
        util.message = 'Password is Required';
        util.statusCode = 400;
        return util.send(res);
      }

      const currentUser = await userService.findByEmail(email);
      if (!currentUser) {
        util.message = 'User not exist';
        util.statusCode = 404;
        return util.send(res);
      }
      if (currentUser.isVerified === false) {
        util.message = 'Please Verify your account';
        util.statusCode = 400;
        return util.send(res);
      }
      if (currentUser.socialId !== null) {
        util.setError(400, `Please Login using your ${currentUser.provider} Account`);
        return util.send(res);
      }
      const isMatch = await bcrypt.compare(password, currentUser.password);
      if (isMatch) {
        const displayData = pick(currentUser.dataValues, ['firstName', 'lastName', 'email', 'id', 'RoleId']);
        const authToken = AuthTokenHelper.generateToken(displayData);
        userService.updateAtt({ authToken }, { email: displayData.email });
        util.statusCode = 200;
        util.type = 'success';
        util.message = 'User Logged in Successfully';
        util.data = { displayData, authToken };
        return util.send(res);
      }
      util.setError(401, 'Incorrect username or password');
      return util.send(res);
    } catch (err) {
      util.setError(400, err.message);
      return util.send(res);
    }
  }

  static async changeRole(req, res, next) {
    try {
      const { id } = req.params;
      const { roleId } = req.body;
      const userExist = await userService.findById(id);
      if (userExist) {
        const update = await userService.updateAtt({ RoleId: roleId }, { id });
        util.setSuccess('200', 'Role Updated');
        return util.send(res);
      }
      util.setError(400, 'The user doesn\'t exist');
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async userLogout(req, res) {
    try {
      const queryResult = await userService.updateAtt(
        { authToken: null },
        { id: res.id },
      );
      util.setSuccess('200', 'Logout successful');
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async assignUsers(req, res) {
    try {
      const { lineManagerId } = req.body;
      const { userId } = req.body;
      const lineManager = await userService.findByLineManagerId(lineManagerId);
      if (lineManager) {
        const update = await userService.updateAtt({ lineManager: lineManagerId }, { id: userId });
        util.setSuccess('200', 'user is assigned to the manager');
        return util.send(res);
      }
      util.setError(400, 'The manager doesn\'t exist');
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async getUsers(req, res) {
    try {
      const { id } = req.params;
      const users = await userService.getUsers(id);
      if (users.length >= 1) {
        const message = 'the users assigned to that manager are found';
        util.setSuccess(200, message, users);
        return util.send(res);
      }
      util.setError(400, 'The manager doesn\'t have users');
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async updateProfile(req, res) {
    try {
      const { id } = req.userInfo;
      const {
        firstName, lastName, email, preferedLanguage, officeAddress,
      } = req.body;

      const userExist = await userService.findById(id);
      if (userExist) {
        const update = await userService.updateAtt({
          firstName, lastName, email, preferedLanguage, officeAddress,
        }, { id });
        util.setSuccess('200', 'user profile updated');
        return util.send(res);
      }
      util.setError(400, 'The user doesn\'t exist');
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async getProfile(req, res) {
    try {
      const { id } = req.params;
      const {
        firstName, lastName, email, profilePicture, preferedLanguage, officeAddress,
      } = await userService.findById(id);

      const data = {
        firstName, lastName, email, profilePicture, preferedLanguage, officeAddress,
      };
      const message = 'profile details displayed successfully!';
      util.setSuccess(200, message, data);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'can\'t retrieve the data');
      return util.send(res);
    }
  }

  static async myCredintials(req, res) {
    try {
      const { token } = req.params;
      if (token) {
        const userInfo = await userService.findByProp({ authToken: token });
        if (userInfo[0]) {
          const {
            firstName, lastName, email, id, RoleId, authToken,
          } = userInfo[0];
          util.setSuccess(200, 'LoggedIn', {
            firstName, lastName, email, id, RoleId, authToken,
          });
        } else {
          util.setError(401, 'AUhtentication failed');
        }
        return util.send(res);
      }
      util.setError(400, 'Invalid Token');
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async sendVerificationCode(req, res) {
    // We verify that the client has included the `number` property in their JSON body
    if (!req.body.number) {
      util.setError(400, 'You must supply a `number` prop to send the request to');
      util.send(res);
      return;
    }
    // Send the request to Vonage's servers
    nexmo.verify.request({
      number: req.body.number,
      // You can customize this to show the name of your company
      brand: 'Intercore Events',
      // We could put `'6'` instead of `'4'` if we wanted a longer verification code
      code_length: '4',
    }, (err, result) => {
      if (err) {
        // If there was an error, return it to the client
        util.setError(500, err.error_text);
        util.send(res);
        return;
      }
      // Otherwise, send back the request id. This data is integral to the next step
      const requestId = result.request_id;
      util.setSuccess(200, 'Please Verfication code sent to your phon number, submit to verify your phone number', result);
      util.send(res);
    });
  }

  static async verifyPhoneNumber(req, res) {
    // We require clients to submit a request id (for identification) and a code (to check)
    if (!req.body.requestId || !req.body.code) {
      util.setError(400, 'You must supply a `code` and `request_id` prop to send the request to');
      util.send(res);
      return;
    }
    // const info  = await sendSMS(req.body.number,"You have ticket to attend apr and rayon sport match");
    // util.setSuccess(200, "Message Sent",{info});
    // util.send(res);
    // Run the check against Vonage's servers
    nexmo.verify.check({
      request_id: req.body.requestId,
      code: req.body.code,
    }, (err, result) => {
      if (err) {
        util.setError(500, err.error_text);
        util.send(res);
        return;
      }
      util.setSuccess(200, 'Phone Number Verified Success', { result });
      util.send(res);
    });
  }
}
