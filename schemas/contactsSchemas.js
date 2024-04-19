import Joi from "joi";
import { phoneRegexp } from "../constants/regexp.js";
import { MAXNAME_L, MINNAME_L, MINPHONE_L } from "../constants/customValues.js";

function isValidPhoneInput(input) {
  return (
    phoneRegexp.NORMAL.test(input.trim()) || // Matches (XXX) XXX-XXXX
    phoneRegexp.EXPANDED.test(input.trim()) // Matches XXX-XX-XX
  );
}

export const createContactSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    name: Joi.string().min(MINNAME_L).max(MAXNAME_L).required(),
    phone: Joi.string()
      .min(MINPHONE_L)
      .custom((value, helpers) => {
        if (!isValidPhoneInput(value)) {
          return helpers.error(
            "Phone should match (XXX) XXX-XXXX or XXX-XX-XX format",
            { value }
          );
        }
        return value;
      })
      .required(),
    email: Joi.string().email().required(),
    favorite: Joi.bool(),
  });

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  phone: Joi.string()
    .min(9)
    .custom((value, helpers) => {
      if (value && !isValidPhoneInput(value)) {
        return helpers.error(
          "Phone should match (XXX) XXX-XXXX or XXX-XX-XX format",
          { value }
        );
      }
      return value;
    }),
  email: Joi.string().email(),
  favorite: Joi.bool(),
})
  .options({
    abortEarly: false,
  })
  .or("name", "phone", "email");
