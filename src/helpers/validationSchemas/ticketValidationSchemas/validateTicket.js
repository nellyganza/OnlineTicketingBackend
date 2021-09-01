import joi from 'joi';

export const newTicketBuyer = joi.object({
  lastName: joi.string().required().min(2),
  firstName: joi.string().required().min(2),
  phoneNumber: joi.string().required().pattern(/^\+(?:[0-9] ?){6,14}[0-9]$/),
  email: joi.string().email().required(),
});
export const newTicketAttender = joi.object({
  price: joi.number().required(),
  type: joi.number().required(),
  phoneNumber: joi.string().pattern(/^\+(?:[0-9] ?){6,14}[0-9]$/),
  email: joi.string().email(),
  fullName: joi.string().required().min(2),
  nationalId: joi.string().required().length(16),
  sittingPlace: joi.any(),
});
