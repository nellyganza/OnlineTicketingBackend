import express from 'express';
import { gfs } from '../../../middlewares/mongo/upload';

const router = express.Router();
router.get('/:filename', async (req, res) => {
  try {
    const files = await gfs.find({ filename: req.params.filename }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'no files exist',
      });
    }
    gfs.openDownloadStreamByName(req.params.filename).pipe(res);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const files = await gfs.find().toArray();
    // check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'no files exist',
      });
    }
    return res.json(files);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get('/get/:filename', async (req, res) => {
  try {
    const files = await gfs.find({ filename: req.params.filename }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'no files exist',
      });
    }
    return res.json(files[0]);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
export default router;
