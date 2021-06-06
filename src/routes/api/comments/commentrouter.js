import express from 'express';
import commentsController from '../../../controllers/commentsController';
import { isAuthenticated, allowedRoles } from '../../../middlewares/authorization';

const router = express.Router();
router.get('/', isAuthenticated, allowedRoles([1]), commentsController.allcomment);
router.post('/save', commentsController.savecomment);
router.get('/findById/:id', commentsController.findcomment);
router.get('/findByName/:userName', commentsController.findcommentByuserName);
router.get('/findByEventId/:eventId', commentsController.findcommentByEventId);
router.put('/update/:id', isAuthenticated, allowedRoles([4, 5]), commentsController.updatecomment);
router.delete('/delete/:id', isAuthenticated, allowedRoles([1]), commentsController.deletecomment);
export default router;
