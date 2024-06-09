import joi from 'joi';

export const newEventSchema = joi.object({
  title: joi.string().required().min(2),
  host: joi.string().required(),
  dateAndTimme: joi.date().iso().required(),
  startDate: joi.date().iso().required(),
  endDate: joi.date().iso().required(),
  duration: joi.any().required(),
  place: joi.string().required(),
  image: joi.array(),
  description: joi.string().required().min(15),
  numberofTicket: joi.number().required().min(1),
  categoryId: joi.any().required(),
  country: joi.string().required(),
  share: joi.any(),
  placeImage: joi.any(),
});

export const newPaymentMethodSchema = joi.object({
  name: joi.string().required(),
  value: joi.any().required(),
  accNumber: joi.string().required(),
  accName: joi.string().required(),
  phoneNumber: joi.string().required(),
  email: joi.string().required(),
  flutterId: joi.string().required(),

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
  id: joi.any(),
  title: joi.string().required().min(2),
  host: joi.string().required(),
  dateAndTimme: joi.date().iso().required(),
  startDate: joi.date().iso().required(),
  endDate: joi.date().iso().required(),
  duration: joi.any().required(),
  place: joi.string().required(),
  description: joi.string().required().min(15),
  numberofTicket: joi.number().required().min(0),
  categoryId: joi.any().required(),
  country: joi.string().required(),
  share: joi.boolean().required(),
  status: joi.string().required(),
  placeImage: joi.any(),
  ticketLeft: joi.any(),
});
