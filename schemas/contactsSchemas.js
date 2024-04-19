import Joi from "joi";

import { joiValidator } from "../helpers/validateBody.js";
import { phoneRegexp } from "../constants/regexp.js";
import { MAXNAME_L, MINNAME_L, MINPHONE_L } from "../constants/customValues.js";

function canPassPhoneRegexp(input) {
  return (
    phoneRegexp.NORMAL.test(input.trim()) || // Matches (XXX) XXX-XXXX
    phoneRegexp.EXPANDED.test(input.trim()) // Matches XXX-XX-XX
  );
}

function isValidPhoneInput(value, helpers) {
  if (value && !canPassPhoneRegexp(value)) {
    return helpers.message(
      `"phone" with value "${value}" fails to match the required pattern: (XXX) XXX-XXXX or XXX-XX-XX`
    );
  }
  return value;
}

export const createContactValidator = joiValidator((data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().min(MINNAME_L).max(MAXNAME_L).required(),
      phone: Joi.string()
        .min(MINPHONE_L)
        .custom(isValidPhoneInput, "Phone validation")
        .required(),
      email: Joi.string().email().required(),
      favorite: Joi.bool(),
    })
    .validate(data)
);

export const updateContactValidator = joiValidator((data) =>
  Joi.object({
    name: Joi.string().min(2).max(30),
    phone: Joi.string()
      .min(MINPHONE_L)
      .custom(isValidPhoneInput, "Phone validation")
      .required(),
    email: Joi.string().email(),
    favorite: Joi.bool(),
  })
    .options({
      abortEarly: false,
    })
    .or("name", "phone", "email")
    .validate(data)
);

export const updateContactStatusValidator = joiValidator((data) =>
  Joi.object({
    favorite: Joi.bool().required(),
  })
    .options({
      abortEarly: false,
    })
    .validate(data)
);
