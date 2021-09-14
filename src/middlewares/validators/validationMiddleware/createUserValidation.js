/* eslint-disable consistent-return */
import { UserValidationSchemas } from '../../../helpers/validationSchemas';
import userService from '../../../services/userService';
// import rolePermissionService from '../../services/rolePermissionService';
// import permissionService from '../../services/permissionService';
import roleService from '../../../services/roleService';
import Util from '../../../helpers/utils';
import { joiValidationError } from '../../../helpers/joiErrorTemplate';
import { decodeToken } from '../../verifications/verifyToken';

const {
  validateUser, passwordResetSchema, passwordSchema, signupValidateSchema, tokenValid,
} = UserValidationSchemas;
const util = new Util();

export const createUserValidation = async (req, res, next) => {
  const { error } = validateUser.validate(req.body);
  if (error) {
    util.setError(400, 'Validation error occurred');
    return util.send(res);
  }
  next();
};

export const signupValidate = async (req, res, next) => {
  try {
    const getEmail = await userService.findByProp({
      email: req.body.email,
    });
    if (getEmail[0]) {
      util.setError(409, 'Email already exists');
      return util.send(res);
    }
    const {
      error,
    } = signupValidateSchema.validate({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });
    return joiValidationError(req, res, next, error);
  } catch (error) {
    util.setError(500, error.message.replace('/', '').replace(/"/g, '').replace('WHERE parameter', ''));
    return util.send(res);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const data = await decodeToken(req.params.token);
    const userExist = await userService.findByProp({
      id: data.userId,
    });
    if (userExist[0]) {
      const isVerified = await userService.findByProp({
        isVerified: true,
        id: data.userId,
      });
      if (isVerified[0]) {
        return res.redirect(422, `${process.env.FRONT_END_URL}/login`);
      }
      res.id = data.userId;
      next();
    } else {
      util.setError(404, 'Sorry we can\'t find your account');
      return res.redirect(404, `${process.env.FRONT_END_URL}/`);
    }
  } catch (error) {
    return res.redirect(500, `${process.env.FRONT_END_URL}/`);
  }
};

export const validateEmail = async (req, res, next) => {
  try {
    const {
      error,
    } = passwordResetSchema.validate({
      email: req.body.email,
    });
    if (error) {
      const Error = error.details[0].message.replace('/', '').replace(/"/g, '');
      util.setError(400, Error);
      return util.send(res);
    }
    next();
  } catch (error) {
    util.setError(500, error.message);
    return util.send(res);
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    const data = await decodeToken(req.headers.authorization);
    const { RoleId } = data;
    if (RoleId === 1) {
      next();
    } else {
      util.setError(400, 'Un authorized access');
      return util.send(res);
    }
  } catch (error) {
    util.setError(500, error.message);
    return util.send(res);
  }
};

export const passwordMatch = async (req, res, next) => {
  try {
    const {
      error,
    } = passwordSchema.validate({
      token: req.params.token,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });
    if (error) {
      if (
        error.details[0].message
          .replace('/', '')
          .replace(/"/g, '')
          .includes('confirmPassword')
      ) {
        const Error = {
          error: 'passwords don\'t match',
        };
      }
      const Error = error.details[0].message.replace('/', '').replace(/"/g, '');
      util.setError(400, Error);
      return util.send(res);
    }
    next();
  } catch (error) {
    util.setError(500, error.message);
    return util.send(res);
  }
};

export const roleExist = async (req, res, next) => {
  try {
    const { roleId } = req.body;
    if (roleId) {
      const roleAvailable = await roleService.findById(roleId);
      if (!roleAvailable) {
        util.setError(400, 'Role you want to assign don\'t exists');
        return util.send(res);
      }
      next();
    } else {
      util.setError(400, 'roleId is missing');
      return util.send(res);
    }
  } catch (error) {
    util.setError(500, error.message);
    return util.send(res);
  }
};
