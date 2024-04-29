import { Contact } from "../models/contactModel.js";
import { catchAsyncService } from "../helpers/catchAsync.js";

/**
 * Get contacts service
 * @returns {Promise<Contact[]>} A promise that resolves with an array of contacts.
 * @author Oleksii
 * @cathegory services
 */

// SEARCH
export const listContacts = catchAsyncService(async (owner, query) => {
  const searchQuery = {
    owner,
    ...(query.favorite ? { favorite: query.favorite === "true" } : {}),
  };

  if (query.search) {
    searchQuery.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }

  // INIT DB QUERY
  const contactsQuery = Contact.find(searchQuery);

  // SORTING
  // order = "ASC" | "DESC"
  // sort = "name" | "-name"
  contactsQuery.sort(
    `${query.order === "DESC" ? "-" : ""}${query.sort ?? "name"}`
  );

  // PAGINATION
  const page = query.page ? +query.page : 1;
  const limit = query.limit ? +query.limit : 3;
  const docsToSkip = (page - 1) * limit;

  contactsQuery.skip(docsToSkip).limit(limit);

  const contacts = await contactsQuery;
  const total = await Contact.countDocuments(searchQuery);

  return { contacts, total };
});

/**
 * Retrieves a contact by its ID.
 * @param {string} id The unique identifier of the contact.
 * @param {string} owner Current User.
 * @returns {Promise<Contact>} A promise that resolves with the contact found or null if no contact is found.
 * @author Oleksii
 * @category services
 */
export const getContactById = catchAsyncService((id, owner) => {
  return Contact.findOne({ _id: id, owner });
});

/**
 * Add contact service
 * @param {{ name: string, email: string, phone: string }} userData Object containing the contact data.
 * @param {string} owner Current User.
 * @returns {Promise<Contact>} A promise that resolves with the newly created contact object.
 * @author Oleksii
 * @cathegory services
 */
export const addContact = catchAsyncService(({ name, email, phone }, owner) =>
  Contact.create({ name, email, phone, owner })
);

/**
 * Removes a contact by its ID.
 * @param {string} id The unique identifier of the contact to remove.
 * @param {string} owner Current User.
 * @returns {Promise<Contact>} A promise that resolves with the deleted contact document or null if no contact is found.
 * @author Oleksii
 * @category services
 */
export const removeContact = catchAsyncService(async (id, owner) =>
  Contact.findOneAndDelete({ _id: id, owner })
);

/**
 * Updates a contact by its ID.
 * @param {{ id: string, name: string, email: string, phone: string, owner: string }} contactData Object containing the contact's ID, new data to update and current User.
 * @returns {Promise<Contact>} A promise that resolves with the updated contact document or null if no update is made.
 * @author Oleksii
 * @category services
 */
export const updateContact = catchAsyncService(
  async ({ id, name, email, phone, owner }) =>
    Contact.findOneAndUpdate(
      { _id: id, owner },
      { name, email, phone },
      { new: true }
    )
);

/**
 * Updates the status of a contact by its ID.
 * @param {{ id: string, owner: string, favorite: boolean }} statusData Object containing the contact's ID, current User and the new 'favorite' status to apply.
 * @returns {Promise<Contact>} A promise that resolves with the updated contact document or null if no update is made.
 * @author Oleksii
 * @category services
 */
export const updateStatusContact = catchAsyncService(
  async ({ id, owner, favorite }) =>
    Contact.findOneAndUpdate({ _id: id, owner }, { favorite }, { new: true })
);
