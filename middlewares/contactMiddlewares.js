import contactsService from "../services/contactsServices.js";

export const checkContactId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contactsDB = await contactsService.listContacts();

    const contact = contactsDB.find((c) => c.id === id);

    if (!contact) {
      return res.status(404).json({
        msg: "Not found",
      });
    }

    req.contact = contact;

    next();
  } catch (error) {
    console.error(colors.red("internal server error: "), error.message);
    res.status(500).json({
      msg: "internal server error...",
    });
  }
};
