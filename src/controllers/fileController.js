import userService from '../services/userService';
import eventService from '../services/eventService';
import Util from '../helpers/utils';
import { cloudinaryUploader } from '../helpers/cloudinaryUploader';
import 'dotenv/config';

const fsPromises = require('fs').promises;

const directory = '../public/images';

const util = new Util();
const upload = async (req, res) => {
  try {
    const { id } = req.userInfo;
    await userService.findById(id);
    const { path } = req.files[0];
    const url = await cloudinaryUploader(path);
    await userService.updateAtt({ profilePicture: url }, { id });
    const message = 'user profile image updated';
    util.setSuccess(200, message, url);
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
    const urls = data.image || [];
    for (let index = 0; index < req.files.length; index++) {
      const { path } = req.files[index];
      const url = await cloudinaryUploader(path);
      urls.push(url);
    }
    const updatedEvent = await eventService.updateAtt({ image: urls }, { id: eventId });
    const message = 'Event Images Uploaded';
    await fsPromises.rmdir(directory, {
      recursive: true,
    });
    util.setSuccess(200, message, updatedEvent);
    return util.send(res);
  } catch (error) {
    util.setError(500, error);
    return util.send(res);
  }
};

const setEventImages = async (req, res) => {
  try {
    let urls = [];
    const { eventId } = req.query;
    if (eventId) {
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
      urls = data.image || [];
    }

    for (let index = 0; index < req.files.length; index++) {
      const { path } = req.files[index];
      const url = await cloudinaryUploader(path);
      urls.push(url);
    }

    // await fsPromises.rmdir(directory, {
    //   recursive: true,
    // });
    util.setSuccess(200, 'Image Uploaded', { urls });
    return util.send(res);
  } catch (error) {
    util.setError(500, error);
    return util.send(res);
  }
};

module.exports = {
  upload,
  uploadEvents,
  setEventImages,
};
