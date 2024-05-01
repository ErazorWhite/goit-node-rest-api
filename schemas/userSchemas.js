import Joi from "joi";
import { PASSWD_REGEX } from "../constants/regexp.js";
import { subscriptionType } from "../constants/customValues.js";

export const registerUserSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(PASSWD_REGEX)
      .message(
        "Password should have from 8 to 128 characters, at least one upper case letter (A-Z), at least one lower case letter (a-z), at least one digit (0-9), at least one special character."
      )
      .required(),
  });

export const loginUserSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(PASSWD_REGEX)
      .message("Anauthorized")
      .required(),
  });

export const subscriptionUserSchema = Joi.object().keys({
  subscription: Joi.string()
    .valid(...Object.values(subscriptionType))
    .required(),
});
