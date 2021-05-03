import express from 'express';
import txController from '../../../controllers/transactionController';
const router = express.Router();


router.get('/',txController.getAllTransactions)

export default router;