import joi from 'joi';

export const newEventSchema = joi.object({
  title: joi.string().required().min(2),
  host: joi.string().required(),
  dateAndTimme: joi.date().iso().required(),
  place: joi.string().required(),
  image: joi.array(),
  description: joi.string().required().min(15),
  numberofTicket: joi.number().required().min(1),
  eventType: joi.string().required(),
  country: joi.string().required(),
});

export const newPaymentMethodSchema = joi.object({
  name: joi.string().required(),
  value: joi.string().required().min(10),
});
export const newStittingPlaceSchema = joi.object({
  name: joi.string().required(),
  totalPlaces: joi.number().required(),
  placeAvailable: joi.array().required(),
});
export const newPaymentGradeCost = joi.object({
  name: joi.string().required(),
  price: joi.number().required(),
});

export const oldEventSchema = joi.object({
  title: joi.string().min(2),
  host: joi.string(),
  dateAndTimme: joi.date().iso(),
  place: joi.string(),
  image: joi.array(),
  description: joi.string().min(15),
  numberofTicket: joi.number().min(1),
  eventType: joi.string(),
  country: joi.string(),
  status: joi.string(),
});
