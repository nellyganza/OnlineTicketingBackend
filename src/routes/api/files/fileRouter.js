import express from 'express';
import { gfs } from '../../../middlewares/mongo/upload';

const router = express.Router();
router.get('/:filename', (req, res) => {
  const file = gfs
    .find({
      filename: req.params.filename,
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'no files exist',
        });
      }
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});

router.get('/', (req, res) => {
  gfs.find().toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'no files exist',
      });
    }

    return res.json(files);
  });
});

router.get('/get/:filename', (req, res) => {
  gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'no files exist',
      });
    }

    return res.json(files[0]);
  });
});
export default router;

// (err, file) => {
//   if (!file) {
//     return res.status(404).json({
//       err: "no files exist"
//     });
//   }

//   return res.json(file);
// }
