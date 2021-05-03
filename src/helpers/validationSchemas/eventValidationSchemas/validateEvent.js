import joi from 'joi';

export const newEventSchema = joi.object({
  title: joi.string().required().min(2),
  host: joi.string().required(),
  managerId: joi.number(),
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
