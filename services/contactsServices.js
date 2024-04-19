import * as path from "path";
import { Contact } from "../models/contactModel.js";
import { catchAsyncService } from "../helpers/catchAsync.js";

const contactsPath = path.resolve("db", "contacts.json");

export const listContacts = catchAsyncService(async () => {
  return await Contact.find();
});

export const getContactById = catchAsyncService(async (id) => {
  return await Contact.findOne({ _id: id });
});

export const addContact = catchAsyncService(async ({ name, email, phone }) => {
  return await Contact.create({ name, email, phone });
});

export const removeContact = catchAsyncService(async (id) => {
  return Contact.findByIdAndDelete({ _id: id });
});

export const updateContact = catchAsyncService(
  async ({ id, name, email, phone }) => {
    return await Contact.findByIdAndUpdate(
      { _id: id },
      { name, email, phone },
      { new: true }
    );
  }
);
