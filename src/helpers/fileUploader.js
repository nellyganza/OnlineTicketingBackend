import multer from 'multer';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    console.log('multing');
    cb(null, `${__dirname}/../public/images`);
  },
  filename(req, file, cb) {
    console.log('Multing filename');
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const fileUploader = multer({ storage });
