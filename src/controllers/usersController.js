import bcrypt from 'bcrypt';
import { pick } from 'lodash';
import { sendLink } from '../utils/sendVerificationLink';
import { newJwtToken } from '../helpers/tokenGenerator';
import Util from '../helpers/utils';
import userService from '../services/userService';
import eventService from '../services/eventService';
import conactsService from '../services/contactService';
import ticketService from '../services/ticketService';
import AuthTokenHelper from '../helpers/AuthTokenHelper';
import tokenService from '../services/tokenService';
import { nexmo } from '../config/nexmo';
import { sendSMS } from '../helpers/notifications/smsNotification';
import {
  sendPasswordResetLink,
} from '../utils/sendPasswordLInk';
import 'dotenv/config';

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
        const token = await newJwtToken(payload);
        await tokenService.createToken({ token, user: newUser.id });
        const encodedToken = Buffer.from(token).toString('base64');
        return res.redirect(`${process.env.FRONT_END_URL}/socialAuth/success/${encodedToken}`);
      }
    } catch (error) {
      console.log(error);
      return res.redirect(`${process.env.FRONT_END_URL}/socialAuth/failure/error`);
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
      const token = await newJwtToken({ userId: id, RoleId });
      return res.redirect(`${process.env.FRONT_END_URL}/login?statusCode=200`);
    } catch (error) {
      return res.redirect(`${process.env.FRONT_END_URL}/login?statusCode=500`);
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
        util.setError(400, 'Email is Required');
        return util.send(res);
      }
      if (password === null) {
        util.setError(400, 'Password is Required');
        return util.send(res);
      }

      const currentUser = await userService.findByEmail(email);
      if (!currentUser) {
        util.setError(404, 'User not exist');
        return util.send(res);
      }
      if (currentUser.isVerified === false) {
        util.setError(400, 'Please Verify your account');
        return util.send(res);
      }
      if (currentUser.status === 'broked') {
        util.setError(403, 'Your account was Blocked, Please Contact Adiministrator.');
        return util.send(res);
      }

      if (currentUser.socialId !== null) {
        util.setError(400, `Please Login using your ${currentUser.provider} Account`);
        return util.send(res);
      }
      const isMatch = await bcrypt.compare(password, currentUser.password);
      if (isMatch) {
        const displayData = pick(currentUser.dataValues, ['id', 'email', 'firstName', 'lastName', 'RoleId', 'isVerified', 'status', 'phoneNumber', 'category', 'campanyName', 'profilePicture']);
        const authToken = AuthTokenHelper.generateToken(displayData);
        await tokenService.createToken({ token: authToken, user: displayData.id });
        util.setSuccess(200, 'User LoggedIn Successfully', { displayData, authToken });
        return util.send(res);
      }
      util.setError(401, 'Incorrect username or password');
      return util.send(res);
    } catch (err) {
      util.setError(400, err.message);
      return util.send(res);
    }
  }

  static async brokeUser(req, res) {
    try {
      const { id } = req.params;
      const status = 'broked';
      const status1 = 'active';
      const userExist = await userService.findById(id);
      if (userExist) {
        if (userExist.status === 'active') {
          await userService.updateAtt({ status }, { id });
          util.setSuccess(200, 'User broked successfully');
          return util.send(res);
        }
        await userService.updateAtt({ status: status1 }, { id });
        util.setSuccess(200, 'User is unbroked successfully');
        return util.send(res);
      }
      util.setError(400, 'The user doesn\'t exist');
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
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
      const removedToken = await tokenService.deleteToken(res.token);
      util.setSuccess('200', 'Logout successful', removedToken);
      return util.send(res);
    } catch (error) {
      console.log(error);
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async getUsers(req, res) {
    try {
      const users = await userService.getUsers();
      if (users.length >= 1) {
        const message = 'the users are found';
        util.setSuccess(200, message, users);
        return util.send(res);
      }
      util.setError(400, 'users not found');
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async getManagerUsers(req, res) {
    try {
      const users = await userService.getAdminUsers();
      if (users.length >= 1) {
        const message = 'the users are found';
        util.setSuccess(200, message, users);
        return util.send(res);
      }
      util.setError(400, 'ther user not found');
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async updateProfile(req, res) {
    try {
      const { id } = req.userInfo;

      const userExist = await userService.findById(id);
      if (userExist) {
        const update = await userService.updateAtt({ ...req.body }, { id });
        if (update) {
          util.setSuccess('200', 'user profile updated');
          return util.send(res);
        }
        util.setError(400, 'user profile not updated');
        return util.send(res);
      }
      util.setError(400, 'The user doesn\'t exist');
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async myCredintials(req, res) {
    try {
      const { token } = req.params;
      if (token) {
        const foundToken = await tokenService.findByToken({ token });
        const userInfo = await userService.findById(foundToken.user);
        if (userInfo) {
          const {
            id, email, firstName, lastName, RoleId, isVerified, status, phoneNumber, category, campanyName, profilePicture, authToken,
          } = userInfo;
          const displayData = {
            id, email, firstName, lastName, RoleId, isVerified, status, phoneNumber, category, campanyName, profilePicture,
          };
          util.setSuccess(200, 'User LoggedIn Successfully', { displayData, authToken: foundToken.token });
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

  static async myAllData(req, res) {
    try {
      const { id } = req.userInfo;
      const userInfo = await userService.findByAllData({ id });
      util.setSuccess(200, 'User Data', {
        userInfo,
      });
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

  static async getNumberOfAllUsers(req, res) {
    try {
      const numusers = await userService.numberOfUsers();
      const numevents = await eventService.numberOfEvents();
      const nummessages = await conactsService.numberOfMessages();
      const totalIncome = await ticketService.totalIcome();
      const data = {
        Users: numusers,
        Events: numevents,
        Messages: nummessages,
        Income: totalIncome,
      };
      util.setSuccess(200, 'Data Result', { ...data });
      return util.send(res);
    } catch (error) {
      util.setError(500, error);
      return util.send(res);
    }
  }
}
