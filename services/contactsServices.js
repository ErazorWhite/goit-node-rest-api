import * as fs from "fs/promises";
import * as path from "path";
import { v4 } from "uuid";
import colors from "colors";

const contactsPath = path.resolve("db", "contacts.json");

const contactsService = {};

export const listContacts = async () => {
  try {
    const readResult = await fs.readFile(contactsPath, { encoding: "utf-8" });

    return JSON.parse(readResult);
  } catch (error) {
    console.error(colors.red("Error:"), error.message);
    return null;
  }
};

export const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();

    const requiredContact = contacts?.find(
      (contact) => contact.id === contactId
    );

    return requiredContact || null;
  } catch (error) {
    console.error(colors.red("Error:"), error.message);
    return null;
  }
};

export const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();

    if (!contacts) return null;

    const index =
      contacts?.findIndex((contact) => contact.id === contactId) || -1;

    if (index === -1) return null;

    const [removedContact] = contacts.splice(index, 1);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return removedContact;
  } catch (error) {
    console.error(colors.red("Error:"), error.message);
    return null;
  }
};

export const addContact = async ({ name, email, phone }) => {
  try {
    const contacts = await listContacts();

    if (!contacts) return null;

    const newContact = {
      id: v4(),
      name,
      email,
      phone,
    };

    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return newContact;
  } catch (error) {
    console.error(colors.red("Error:"), error.message);
    return null;
  }
};

export const updateContact = async ({ contactId, name, email, phone }) => {
  try {
    const oldContact = await getContactById(contactId);
    if (!oldContact) return null;

    const updatedContact = {
      id: oldContact.id,
      name: name || oldContact.name,
      email: email || oldContact.email,
      phone: phone || oldContact.phone,
    };

    const contacts = await listContacts();
    const index = contacts.findIndex((c) => c.id === contactId);

    contacts[index] = updatedContact;

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return updatedContact;
  } catch (error) {
    console.error(colors.red("Error:"), error.message);
    return null;
  }
};
