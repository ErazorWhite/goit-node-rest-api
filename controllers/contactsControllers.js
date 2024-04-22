import HttpError from "../helpers/HttpError.js";
import { catchAsync } from "../helpers/catchAsync.js";
import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContact,
  updateStatusContact,
} from "../services/contactsService.js";

export const getAllContacts = catchAsync(async (_req, res) => {
  const contactsDB = await listContacts();
  res.status(200).json({
    contactsDB,
  });
});

export const getOneContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const contact = await getContactById(id);

  if (!contact) throw HttpError(404);

  res.status(200).json({
    contact,
  });
});

export const deleteContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deleteContact = await removeContact(id);

  if (!deleteContact) throw HttpError(404);

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
  const { id } = req.params;

  const updatedContact = await updateContact({
    id,
    ...req.body,
  });

  if (!updatedContact) throw HttpError(404);

  res.status(200).json({
    updatedContact,
  });
});

export const changeContactStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedContactStatus = await updateStatusContact({
    id,
    ...req.body,
  });

  if (!updatedContactStatus) throw HttpError(404);

  res.status(200).json({
    updatedContactStatus,
  });
});
