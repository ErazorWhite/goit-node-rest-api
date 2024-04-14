import catchAsync from "../helpers/catchAsync.js";
import contactsService from "../services/contactsServices.js";

export const getAllContacts = catchAsync(async (req, res) => {
  const contactsDB = await contactsService.listContacts();
  res.status(200).json({
    contactsDB,
  });
});

export const getOneContact = (req, res) => {
  const contact = req.contact;
  res.status(200).json({
    contact,
  });
};

export const deleteContact = catchAsync(async (req, res) => {
  const contactId = req.contact.id;
  const deleteContact = await contactsService.removeContact(contactId);
  res.status(200).json({
    deleteContact,
  });
});

export const createContact = catchAsync(async (req, res) => {
  const newContact = req.body;
  const createNewContact = await contactsService.addContact(newContact);

  res.status(200).json({
    createNewContact,
  });
});

export const updateContact = catchAsync(async (req, res) => {
  const contactId = req.contact.id;
  const updateContact = await contactsService.updateContact({
    contactId,
    ...req.body,
  });
  res.status(200).json({
    updateContact,
  });
});
