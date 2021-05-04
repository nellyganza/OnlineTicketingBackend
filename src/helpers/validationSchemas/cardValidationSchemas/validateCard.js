import joi from 'joi';

export const newCardShemas = joi.object({
  cardNumber: joi.string().required().pattern(/[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}/),
  phoneNumber: joi.string().required().pattern(/^\+(?:[0-9] ?){6,14}[0-9]$/),
  fullName: joi.string().required().min(2),
});
