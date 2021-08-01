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
router.get('/getAll/:token', usersController.myAllData);
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
router.get('/manager/viewUsers', isAuthenticated, allowedRoles([1]), usersController.getUsers);
router.get('/admin/viewUsers', isAuthenticated, allowedRoles([1]), usersController.getManagerUsers);
router.put('/updateProfile', isAuthenticated, usersController.updateProfile);
router.post('/upload', fileUploader.any(), fileController.upload);
router.put('/brokeUser/:id', isAuthenticated, allowedRoles([1]), usersController.brokeUser);
router.get('/calculate', isAuthenticated, allowedRoles([1, 2, 3]), usersController.getNumberOfAllUsers);
export default router;
