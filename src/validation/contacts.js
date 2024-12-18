import Joi from "joi";

export const createContactsSchema = Joi.object({
	name: Joi.string().min(3).max(20).required(),
	phoneNumber: Joi.string().min(3).max(20).required(),
	email: Joi.string().min(3).max(20),
	isFavourite: Joi.boolean(),
	contactType: Joi.string().valid("personal", "work", "home").required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});