import Joi from "joi";

import { isValidPhoneInput } from "../services/contactsServices.js";

export const createContactSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    name: Joi.string().min(2).max(30).required(),
    phone: Joi.string()
      .min(9)
      .custom((value, helpers) => {
        if (!isValidPhoneInput(value)) {
          return helpers.error(
            "Phone should matches (XXX) XXX-XXXX or XXX-XX-XX format",
            { value }
          );
        }
        return value;
      })
      .required(),
    email: Joi.string().email().required(),
  });

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  phone: Joi.string()
    .min(9)
    .custom((value, helpers) => {
      if (value && !isValidPhoneInput(value)) {
        return helpers.error(
          "Phone should matches (XXX) XXX-XXXX or XXX-XX-XX format",
          { value }
        );
      }
      return value;
    }),
  email: Joi.string().email(),
})
  .options({
    abortEarly: false,
  })
  .or("name", "phone", "email");
