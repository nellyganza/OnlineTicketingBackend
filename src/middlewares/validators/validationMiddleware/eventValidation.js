import { EventValidationSchemas } from '../../../helpers/validationSchemas';
import Util from '../../../helpers/utils';
import { cloudinaryUploader } from '../../../helpers/cloudinaryUploader';

const {
  newEventSchema, newPaymentMethodSchema, newStittingPlaceSchema, newPaymentGradeCost,
} = EventValidationSchemas;

const util = new Util();

export const newEventEventValidation = (req, res, next) => {
  const {
    event, paymentMethod, sittingPlace, paymentGradeCost,
  } = req.body;
  const newEvent = () => {
    try {
      const { error } = newEventSchema.validate(event);
      if (error) {
        const Error = error.details[0].message.replace('/', '').replace(/"/g, '');
        util.setError(400, Error);
        return util.send(res);
      }
    } catch (error) {
      util.setError(500, error);
      return util.send(res);
    }
  };
  const paymentM = () => {
    try {
      const paymentErrors = [];
      Object.keys(paymentMethod).forEach((method) => {
        const { error } = newPaymentMethodSchema.validate(paymentMethod[method]);
        if (error) {
          const Error = error.details[0].message.replace('/', '').replace(/"/g, '');
          paymentErrors.push(Error);
        }
      });
      if (paymentErrors.length > 0) {
        util.setError(400, paymentErrors);
        return util.send(res);
      }
    } catch (error) {
      util.setError(500, error);
      return util.send(res);
    }
  };
  const sittiPlace = () => {
    try {
      const paymentErrors = [];
      Object.keys(sittingPlace).forEach((sitti) => {
        const { error } = newStittingPlaceSchema.validate(sittingPlace[sitti]);
        if (error) {
          const Error = error.details[0].message.replace('/', '').replace(/"/g, '');
          paymentErrors.push(Error);
        }
      });
      if (paymentErrors.length > 0) {
        util.setError(400, paymentErrors);
        return util.send(res);
      }
    } catch (error) {
      util.setError(500, error);
      return util.send(res);
    }
  };
  const paymentGrade = () => {
    try {
      const paymentErrors = [];
      Object.keys(paymentGradeCost).forEach((grade) => {
        const { error } = newPaymentGradeCost.validate(paymentGradeCost[grade]);
        if (error) {
          const Error = error.details[0].message.replace('/', '').replace(/"/g, '');
          paymentErrors.push(Error);
        }
      });
      if (paymentErrors.length > 0) {
        util.setError(400, paymentErrors);
        return util.send(res);
      }
    } catch (error) {
      util.setError(500, error);
      return util.send(res);
    }
  };

  try {
    newEvent(req, res);
    paymentM(req, res);
    sittiPlace();
    paymentGrade();
    next();
  } catch (error) {
    util.setError(500, error);
    return util.send(res);
  }
};
export const eventUpdate = (req, res, next) => {
  try {
    const { error } = newEventEventValidation.validate(req.body);
    if (error) {
      const Error = error.details[0].message.replace('/', '').replace(/"/g, '');
      util.setError(400, Error);
      return util.send(res);
    }
    next();
  } catch (error) {
    util.setError(500, error.message);
    return util.send(res);
  }
};
export const checkDates = (req, res, next) => {
  try {
    const datetime = new Date();
    const date = datetime.toISOString().slice(0, 10);
    const { dateAndTimme } = req.body.event;
    if (dateAndTimme >= date) {
      next();
    } else {
      util.setError(400, 'Event Time Can\'t be in past');
      return util.send(res);
    }
  } catch (error) {
    util.setError(500, error);
    return util.send(res);
  }
};

export const eventImages = async (req, res, next) => {
  try {
    const images = [];

    if (req.images.length > 0) {
      for (let index = 0; index < req.images.length; index++) {
        const { path } = req.images[index];
        const url = await cloudinaryUploader(path);
        images.push(url);
      }
      req.images = images;
      next();
    } else {
      util.setError(400, 'Provide one Event image at least');
      return util.send(res);
    }
  } catch (error) {
    util.setError(500, error.message);
    return util.send(res);
  }
};
