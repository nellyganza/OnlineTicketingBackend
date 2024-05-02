import express from 'express';
import passport from 'passport';
import { USER_ROLES } from '../../../UIConstants/UserRoles';
import fileController from '../../../controllers/fileController';
import usersController from '../../../controllers/usersController';
import { fileUploader } from '../../../helpers/fileUploader';
import { getProvider } from '../../../helpers/socialProvider';
import { OAuth, ValidationMiddleWare } from '../../../middlewares';
import { allowedRoles, isAuthenticated } from '../../../middlewares/authorization';
import { upload } from '../../../middlewares/mongo/upload';
import authorizationValidator from '../../../middlewares/validators/isAuthenticated';
import verification from '../../../middlewares/verifications/verification';

const router = express.Router();

const {
  createUserValidation, signupValidate, passwordMatch, roleExist, validateEmail, verifyAdmin, verifyEmail,
} = ValidationMiddleWare;
router.get('/me/:token', usersController.myCredintials);
router.get('/getAll', isAuthenticated, usersController.myAllData);
router.post('/signup', upload.array('file', 10), signupValidate, usersController.signupWithEmail);
router.get('/verify/:token', verifyEmail, usersController.verifyEmail);
router.post('/request/phoneNumber', usersController.sendVerificationCode);
router.post('/phone/verifyPhoneNumber', usersController.verifyPhoneNumber);
router.post('/login', createUserValidation, usersController.login);
router.get('/login/:provider', getProvider);
router.post('/logout', authorizationValidator.isTokenExist, authorizationValidator.isTokenValid, authorizationValidator.isUserExists, usersController.userLogout);
router.get('/auth/google/redirect', passport.authenticate('google', { session: false }), OAuth.googleAuth);
router.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), OAuth.facebookAuth);
router.post('/forgot-password', validateEmail, verification.email, usersController.resetPassword);
router.put('/reset-password/:token', passwordMatch, verification.tokenValid, usersController.changePassword);
router.put('/changeRole/:id', isAuthenticated, allowedRoles([USER_ROLES.SUPER_ADMIN]), roleExist, usersController.changeRole);
router.get('/manager/viewUsers', isAuthenticated, allowedRoles([USER_ROLES.SUPER_ADMIN]), usersController.getUsers);
router.get('/admin/viewUsers', isAuthenticated, allowedRoles([USER_ROLES.SUPER_ADMIN]), usersController.getManagerUsers);
router.get('/find/:name/:value', isAuthenticated, allowedRoles([USER_ROLES.SUPER_ADMIN]), usersController.findByCategory);
router.put('/updateProfile', isAuthenticated, upload.array('file', 10), usersController.updateProfile);
router.put('/update/user', isAuthenticated, usersController.updateUserInfo);
router.post('/upload', fileUploader.any(), fileController.upload);
router.put('/brokeUser/:id', isAuthenticated, allowedRoles([USER_ROLES.SUPER_ADMIN]), usersController.brokeUser);
router.put('/admin/verify/:id', isAuthenticated, allowedRoles([USER_ROLES.SUPER_ADMIN]), usersController.verifyByAdmin);
router.get('/calculate/count', isAuthenticated, allowedRoles([USER_ROLES.SUPER_ADMIN, USER_ROLES.EVENT_MANAGER, USER_ROLES.EVENT_ATTERNDER]), usersController.getNumberOfAllUsers);
router.get('/account/manager', usersController.getManagerAccount);
router.get('/chartData/:year', isAuthenticated, usersController.getChartNumbers);
router.post('/validator/new', isAuthenticated, allowedRoles([USER_ROLES.SUPER_ADMIN, USER_ROLES.EVENT_MANAGER]), signupValidate, usersController.createValidator);
router.get('/validator/find', isAuthenticated, allowedRoles([USER_ROLES.SUPER_ADMIN, USER_ROLES.EVENT_MANAGER]), usersController.findValidator);
export default router;
