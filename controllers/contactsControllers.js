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

export const getAllContacts = catchAsync(async (req, res) => {
  const currentUser = req.user.id;
  const { contacts, total } = await listContacts(currentUser, req.query);
  res.status(200).json({
    total,
    contacts,
  });
});

export const getOneContact = catchAsync(async (req, res) => {
  const currentUser = req.user.id;
  const { id } = req.params;
  const contact = await getContactById(id, currentUser);

  if (!contact) throw HttpError(404);

  res.status(200).json({
    contact,
  });
});

export const deleteContact = catchAsync(async (req, res) => {
  const currentUser = req.user.id;
  const { id } = req.params;
  const deleteContact = await removeContact(id, currentUser);

  if (!deleteContact) throw HttpError(404);

  res.status(200).json({
    deleteContact,
  });
});

export const createContact = catchAsync(async (req, res) => {
  const currentUser = req.user.id;
  const newContact = req.body;
  const createNewContact = await addContact(newContact, currentUser);
  if (!createNewContact) throw HttpError(500, "Can't create user");

  res.status(201).json({
    createNewContact,
  });
});

export const changeContact = catchAsync(async (req, res) => {
  const currentUser = req.user.id;
  const { id } = req.params;

  const updatedContact = await updateContact({
    id,
    owner: currentUser,
    ...req.body,
  });

  if (!updatedContact) throw HttpError(404);

  res.status(200).json({
    updatedContact,
  });
});

export const changeContactStatus = catchAsync(async (req, res) => {
  const currentUser = req.user.id;
  const { id } = req.params;

  const updatedContactStatus = await updateStatusContact({
    id,
    owner: currentUser,
    ...req.body,
  });

  if (!updatedContactStatus) throw HttpError(404);

  res.status(200).json({
    updatedContactStatus,
  });
});
