import HttpError from "../helpers/HttpError.js";
import { catchAsync } from "../helpers/catchAsync.js";
import { getContactById, listContacts } from "../services/contactsServices.js";

export const checkContactId = catchAsync(async (req, _res, next) => {
  const { id } = req?.params;
  const contact = await getContactById(id);
  if (!contact) throw HttpError(404, "Contact not found");
  req.contact = contact;
  next();
});
