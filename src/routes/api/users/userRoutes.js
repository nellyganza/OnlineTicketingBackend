import express from 'express';
import passport from 'passport';
import usersController from '../../../controllers/usersController';
import fileController from '../../../controllers/fileController';
import { fileUploader } from '../../../helpers/fileUploader';
import { OAuth, ValidationMiddleWare } from '../../../middlewares';
import { getProvider } from '../../../helpers/socialProvider';
import verification from '../../../middlewares/verifications/verification';
import authorizationValidator from '../../../middlewares/validators/isAuthenticated';
import { isAuthenticated, allowedRoles } from '../../../middlewares/authorization';

const router = express.Router();

const {
  createUserValidation, signupValidate, passwordMatch, roleExist, validateEmail, verifyAdmin, verifyEmail,
} = ValidationMiddleWare;
router.get('/me/:token', usersController.myCredintials);
router.post('/signup', signupValidate, usersController.signupWithEmail);
router.get('/verify/:token', verifyEmail, usersController.verifyEmail);
router.post('/request/phoneNumber', usersController.sendVerificationCode);
router.post('/verify/phoneNumber', usersController.verifyPhoneNumber);
router.post('/login', createUserValidation, usersController.login);
router.get('/login/:provider', getProvider);
router.post('/logout', authorizationValidator.isTokenExist, authorizationValidator.isTokenValid, authorizationValidator.isUserExists, usersController.userLogout);
router.get('/auth/google/redirect', passport.authenticate('google', { session: false }), OAuth.googleAuth);
router.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), OAuth.facebookAuth);
router.post('/forgot-password', validateEmail, verification.email, usersController.resetPassword);
router.put('/reset-password/:token', passwordMatch, verification.tokenValid, usersController.changePassword);
router.put('/changeRole/:id', isAuthenticated, allowedRoles([1]), roleExist, usersController.changeRole);
router.put('/manager/assign', isAuthenticated, allowedRoles([3]), usersController.assignUsers);
router.get('/manager/:id', isAuthenticated, allowedRoles([3]), usersController.getUsers);
router.put('/updateProfile', isAuthenticated, usersController.updateProfile);
router.get('/profile/:id', isAuthenticated, usersController.getProfile);
router.put('/upload', isAuthenticated, fileUploader.any(), fileController.upload);
export default router;
