import { catchAsync } from "../helpers/catchAsync.js";
import {
  addContact,
  listContacts,
  removeContact,
  updateContact,
} from "../services/contactsServices.js";

export const getAllContacts = catchAsync(async (_req, res) => {
  const contactsDB = await listContacts();
  res.status(200).json({
    contactsDB,
  });
});

export const getOneContact = (req, res) => {
  const contact = req.contact; // from middleware
  res.status(200).json({
    contact,
  });
};

export const deleteContact = catchAsync(async (req, res) => {
  const id = req.contact.id; // from middleware
  const deleteContact = await removeContact(id);

  res.status(200).json({
    deleteContact,
  });
});

export const createContact = catchAsync(async (req, res) => {
  const newContact = req.body;
  const createNewContact = await addContact(newContact);
  if (!createNewContact) throw HttpError(500, "Can't create user");

  res.status(201).json({
    createNewContact,
  });
});

export const changeContact = catchAsync(async (req, res) => {
  const id = req.contact.id; // from middleware
  const updatedContact = await updateContact({
    id,
    ...req.body,
  });

  res.status(200).json({
    updatedContact,
  });
});
