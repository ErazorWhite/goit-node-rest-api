import HttpError from "../helpers/HttpError.js";
import contactsService from "../services/contactsServices.js";

export const checkContactId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contactsDB = await contactsService.listContacts();

    const contact = contactsDB.find((c) => c.id === id);

    if (!contact) {
      throw HttpError(404, "Contact not found");
    }

    req.contact = contact;

    next();
  } catch (error) {
    next(error);
  }
};
