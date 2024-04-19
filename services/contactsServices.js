import { Contact } from "../models/contactModel.js";
import { catchAsyncService } from "../helpers/catchAsync.js";

export const listContacts = catchAsyncService(async () => {
  return await Contact.find();
});

export const getContactById = catchAsyncService((id) =>
  Contact.findById({ _id: id })
);

export const addContact = catchAsyncService(async ({ name, email, phone }) =>
  Contact.create({ name, email, phone })
);

export const removeContact = catchAsyncService(async (id) =>
  Contact.findByIdAndDelete({ _id: id })
);

export const updateContact = catchAsyncService(
  async ({ id, name, email, phone }) =>
    Contact.findByIdAndUpdate(
      { _id: id },
      { name, email, phone },
      { new: true }
    )
);

export const updateStatusContact = catchAsyncService(async ({ id, favorite }) =>
  Contact.findByIdAndUpdate({ _id: id }, { favorite }, { new: true })
);
