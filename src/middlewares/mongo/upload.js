const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const dbConfig = require('../../config/mongodb/config/db');

const mongoURI = dbConfig.url + dbConfig.database;

// const username = encodeURIComponent("elysee");
// const password = encodeURIComponent("Elysee@123");
// const cluster = "cluster0.3q7qglq.mongodb.net";
// let mongoURI =`mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority`;

// connection
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// init gfs
export let gfs;
conn.once('open', () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });
});

// Storage
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, buf) => {
      if (err) {
        return reject(err);
      }
      const filename = buf.toString('hex') + path.extname(file.originalname);
      const fileInfo = {
        filename,
        bucketName: 'uploads',
      };
      resolve(fileInfo);
    });
  }),
});

storage.on('connection', (db) => {
  console.log('connected');
  // Db is the database instance
});

storage.on('connectionFailed', (err) => {
  // err is the error received from MongoDb
  console.log(err);
});

export const upload = multer({
  storage,
});

export const deleteFileById = (id) => {
  gfs.delete(new mongoose.Types.ObjectId(id), (err, data) => ({ err, data }));
};

export const getFileByFileName = (filename) => {
  gfs.find({ filename }).toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return null;
    }
    return files[0];
  });
};

export const getFileByFileNameAndDelete = (filename) => {
  gfs.find({ filename }).toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return null;
    }
    return deleteFileById(files[0]._id);
  });
};