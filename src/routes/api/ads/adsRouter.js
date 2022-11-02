import express from 'express';
import adsController from '../../../controllers/AdsController';
import { verifyAdmin } from '../../../middlewares/validators/validationMiddleware';

const router = express.Router();
router.post('/create', verifyAdmin, adsController.saveAds);
router.get('/findAll', adsController.getAllAds);
router.delete('/delete/:id', verifyAdmin, adsController.deleteAds);
router.put('/update/:id', verifyAdmin, adsController.updateAds);
router.post('/position/create', verifyAdmin, adsController.saveAdsPosition);
router.get('/position/findAll', adsController.getAllAdsPosition);
router.put('/position/update/:id', verifyAdmin, adsController.updateAdsPosition);

export default router;
