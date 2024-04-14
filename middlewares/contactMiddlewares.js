import HttpError from "../helpers/HttpError.js";
import catchAsync from "../helpers/catchAsync.js";
import contactsService from "../services/contactsServices.js";

export const checkContactId = catchAsync(async (req, _res, next) => {
  const { id } = req.params;

  const contactsDB = await contactsService.listContacts();

  const contact = contactsDB.find((c) => c.id === id);

  if (!contact) {
    throw HttpError(404, "Contact not found");
  }

  req.contact = contact;

  next();
});
