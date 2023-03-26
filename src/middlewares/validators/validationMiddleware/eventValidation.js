import { EventValidationSchemas } from '../../../helpers/validationSchemas';
import Util from '../../../helpers/utils';
import { cloudinaryUploader } from '../../../helpers/cloudinaryUploader';

const {
  newEventSchema, newPaymentMethodSchema, newStittingPlaceSchema, newPaymentGradeCost, oldEventSchema,
} = EventValidationSchemas;

const util = new Util();

const newEvent = (req) => {
  const { event } = req.body;
  const obj = {
    error: false,
    body: {},
  };
  try {
    const { error } = newEventSchema.validate(event);
    if (error) {
      const Error = error.details[0].message.replace('/', '').replace(/"/g, '');
      obj.error = true;
      obj.body = { Error };
      return obj;
    }

    return obj;
  } catch (error) {
    obj.error = true;
    return obj;
  }
};
const paymentM = (req) => {
  let { paymentMethod } = req.body;
  paymentMethod = JSON.parse(paymentMethod);
  req.body.paymentMethod=paymentMethod;
  const obj = {
    error: false,
    body: {},
  };
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
      obj.error = true;
      obj.body = { ...paymentErrors };
      return obj;
    }

    return obj;
  } catch (error) {
    obj.error = true;
    return obj;
  }
};
const sittiPlace = (req) => {
  let { sittingPlace } = req.body;
  sittingPlace = JSON.parse(sittingPlace);
  const obj = {
    error: false,
    body: {},
  };
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
      obj.error = true;
      obj.body = { ...paymentErrors };
      return obj;
    }

    return obj;
  } catch (error) {
    obj.error = true;
    return obj;
  }
};
const paymentGrade = (req) => {
  let { paymentGradeCost } = req.body;
  paymentGradeCost = JSON.parse(paymentGradeCost);
  req.body.paymentGradeCost=paymentGradeCost;
  const obj = {
    error: false,
    body: {},
  };
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
      obj.error = true;
      obj.body = { ...paymentErrors };
      return obj;
    }

    return obj;
  } catch (error) {
    obj.error = true;
    return obj;
  }
};

export const newEventEventValidation = (req, res, next) => {
  try {
    const n = newEvent(req);
    const pm = paymentM(req);
    const s = sittiPlace(req);
    const pg = paymentGrade(req);
    if (n.error || pm.error || s.error || pg.error) {
      const errors = {
        ...n.body, ...pm.error, ...s.body, ...pg.body,
      };
      util.setError(400, errors.Error);
      return util.send(res);
    }
    next();
  } catch (error) {
    util.setError(500, error);
    return util.send(res);
  }
};

export const eventUpdate = (req, res, next) => {
  try {
    const { error } = oldEventSchema.validate(req.body);
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
