import express from 'express';
import {validateCard} from '../../../middlewares/validators/validationMiddleware/cardValidation';
import cardController from '../../../controllers/cardController';
const router = express.Router();
router.post('/',validateCard,cardController.registerCard)
router.get('/getAll',cardController.getAllCard)

export default router;