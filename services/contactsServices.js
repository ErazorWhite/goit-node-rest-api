import { Contact } from "../models/contactModel.js";
import { catchAsyncService } from "../helpers/catchAsync.js";

/**
 * Get contacts service
 * @returns {Promise<Contact[]>} A promise that resolves with an array of contacts.
 * @author Oleksii
 * @cathegory services
 */
export const listContacts = catchAsyncService(async () => {
  return await Contact.find();
});

/**
 * Retrieves a contact by its ID.
 * @param {string} id The unique identifier of the contact.
 * @returns {Promise<Contact>} A promise that resolves with the contact found or null if no contact is found.
 * @author Oleksii
 * @category services
 */
export const getContactById = catchAsyncService((id) =>
  Contact.findById({ _id: id })
);

/**
 * Add contact service
 * @param {{ name: string, email: string, phone: string }} userData Object containing the contact data.
 * @returns {Promise<Contact>} A promise that resolves with the newly created contact object.
 * @author Oleksii
 * @cathegory services
 */
export const addContact = catchAsyncService(async ({ name, email, phone }) =>
  Contact.create({ name, email, phone })
);

/**
 * Removes a contact by its ID.
 * @param {string} id The unique identifier of the contact to remove.
 * @returns {Promise<Contact>} A promise that resolves with the deleted contact document or null if no contact is found.
 * @author Oleksii
 * @category services
 */
export const removeContact = catchAsyncService(async (id) =>
  Contact.findByIdAndDelete({ _id: id })
);

/**
 * Updates a contact by its ID.
 * @param {{ id: string, name: string, email: string, phone: string }} contactData Object containing the contact's ID and new data to update.
 * @returns {Promise<Contact>} A promise that resolves with the updated contact document or null if no update is made.
 * @author Oleksii
 * @category services
 */
export const updateContact = catchAsyncService(
  async ({ id, name, email, phone }) =>
    Contact.findByIdAndUpdate(
      { _id: id },
      { name, email, phone },
      { new: true }
    )
);

/**
 * Updates the status of a contact by its ID.
 * @param {{ id: string, favorite: boolean }} statusData Object containing the contact's ID and the new 'favorite' status to apply.
 * @returns {Promise<Contact>} A promise that resolves with the updated contact document or null if no update is made.
 * @author Oleksii
 * @category services
 */
export const updateStatusContact = catchAsyncService(async ({ id, favorite }) =>
  Contact.findByIdAndUpdate({ _id: id }, { favorite }, { new: true })
);
