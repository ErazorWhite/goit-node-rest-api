import HttpError from "../helpers/HttpError.js";
import { catchAsync } from "../helpers/catchAsync.js";
import { getContactById } from "../services/contactsServices.js";
import {
  createContactValidator,
  updateContactStatusValidator,
  updateContactValidator,
} from "../schemas/contactsSchemas.js";
import { Types } from "mongoose";
import { Contact } from "../models/contactModel.js";

export const checkCreateContact = catchAsync(async (req, _res, next) => {
  const { value, errors } = createContactValidator(req.body);

  if (errors) throw HttpError(400, "Invalid contact data..", errors);

  const contactExists = await Contact.exists({ phone: value.phone });

  if (contactExists)
    throw HttpError(
      409,
      "Contact with such phone number already exists..",
      errors
    );

  req.body = value;

  next();
});

export const checkUpdateContact = catchAsync(async (req, _res, next) => {
  const { value, errors } = updateContactValidator(req.body);

  if (errors) throw HttpError(400, "Invalid contact data..", errors);

  const contactExists = await Contact.exists({ _id: req.contact.id });
  if (!contactExists) throw HttpError(404, errors);

  const phoneExists = await Contact.exists({ phone: req.body.phone });
  if (phoneExists)
    throw HttpError(
      409,
      "Contact with such phone number already exists..",
      errors
    );

  req.body = value;

  next();
});

export const checkContactId = catchAsync(async (req, _res, next) => {
  const { id } = req?.params;

  const idIsValid = Types.ObjectId.isValid(id);

  if (!idIsValid) throw HttpError(404);

  const contact = await getContactById(id);

  if (!contact) throw HttpError(404);

  req.contact = contact;

  next();
});

export const checkUpdateContactStatus = catchAsync(async (req, _res, next) => {
  const { value, errors } = updateContactStatusValidator(req.body);

  if (errors) throw HttpError(400, "Invalid contact data..", errors);

  req.body = value;

  next();
});
