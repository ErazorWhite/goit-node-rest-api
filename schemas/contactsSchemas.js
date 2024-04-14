import Joi from "joi";

function isValidPhoneInput(input) {
  return (
    /^(\(\d{3}\)\s?\d{3}-\d{4})$/.test(input.trim()) || // Matches (XXX) XXX-XXXX
    /^\d{3}-\d{2}-\d{2}$/.test(input.trim()) // Matches XXX-XX-XX
  );
}

export const createContactSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    name: Joi.string().min(2).max(30).required(),
    phone: Joi.string()
      .min(9)
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
})
  .options({
    abortEarly: false,
  })
  .or("name", "phone", "email");
