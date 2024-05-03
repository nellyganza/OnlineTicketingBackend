import 'dotenv/config';
import fs from 'fs';
import { cloudinaryUploader } from '../helpers/cloudinaryUploader';
import Util from '../helpers/utils';
import eventService from '../services/eventService';

const fsPromises = require('fs').promises;

const directory = '../public/images';

const util = new Util();
const upload = async (req, res) => {
  try {
    const { path } = req.files[0];
    const url = await cloudinaryUploader(path);
    const message = 'user profile image updated';
    util.setSuccess(200, message, { url });
    return util.send(res);
  } catch (error) {
    util.setError(500, error.message);
    return util.send(res);
  }
};

const uploadEvents = async (req, res) => {
  try {
    const { eventId } = req.params;
    const eventFound = await eventService.findById(eventId);
    if (!eventFound) {
      util.setError(400, 'Event Not Found');
      util.send(res);
    }
    const data = eventFound.dataValues;
    if (Object.keys(data).length <= 0) {
      util.setError(400, 'Event Not Found');
      util.send(res);
    }
    let imageData = '';
    for (let index = 0; index < req.files.length; index++) {
      const { path } = req.files[index];
      imageData = fs.readFileSync(path);
    }
    const updatedEvent = await eventService.updateAtt({ placeImage: imageData }, { id: eventId });
    const message = 'Event Images Uploaded';
    await fsPromises.rmdir(directory, {
      recursive: true,
    });
    util.setSuccess(200, message, updatedEvent);
    return util.send(res);
  } catch (error) {
    util.setError(500, error.message);
    return util.send(res);
  }
};

const setEventImages = async (req, res, next) => {
  try {
    const urls = [];
    const { eventId } = req.query;
    for (let index = 0; index < req.files.length; index++) {
      const { filename } = req.files[index];
      urls.push(filename);
    }
    if (eventId) {
      req.body.image = urls;
    } else {
      req.body.event.image = urls;
    }
    next();
  } catch (error) {
    util.setError(500, error.message);
    return util.send(res);
  }
};

// const setImageToUrl = async (req, res, next) => {
//   try {
//     let urls = [];
//     const { eventId } = req.query;
//     if (eventId) {
//       const eventFound = await eventService.findById(eventId);
//       if (!eventFound) {
//         util.setError(400, 'Event Not Found');
//         return util.send(res);
//       }
//       const data = eventFound.dataValues;
//       if (Object.keys(data).length <= 0) {
//         util.setError(400, 'Event Not Found');
//         return util.send(res);
//       }
//       urls = data.image || [];
//     }
//     for (let index = 0; index < req.files.length; index++) {
//       const { filename } = req.files[index];
//       urls.push(filename);
//     }
//     if (eventId) {
//       req.body.image = urls;
//     } else {
//       req.body.event.image = urls;
//     }
//     next();
//   } catch (error) {
//     util.setError(500, error.message);;
//     return util.send(res);
//   }
// };

module.exports = {
  upload,
  uploadEvents,
  setEventImages,
};
