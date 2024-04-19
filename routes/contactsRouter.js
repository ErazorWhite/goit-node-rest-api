import { Router } from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  changeContact,
  changeContactStatus,
} from "../controllers/contactsControllers.js";
import { checkContactId, checkCreateContact, checkUpdateContact, checkUpdateContactStatus } from "../middlewares/contactMiddlewares.js";

const contactsRouter = Router();

/**
 * REST api (Create, Read, Update, Delete)
 * POST, GET, PUT, DELETE, PATCH
 *
 * POST         /contacts
 * GET          /contacts
 * GET          /contacts/<contactId>
 * PUT          /contacts/<contactId>
 * DELETE       /contacts/<contactId>
 * PATCH        /contacts/<contactId>/favorite
 */

contactsRouter.get("/", getAllContacts);
contactsRouter.post("/", checkCreateContact, createContact);

contactsRouter.use("/:id", checkContactId);

contactsRouter.get("/:id", getOneContact);
contactsRouter.delete("/:id", deleteContact);
contactsRouter.put("/:id", checkUpdateContact, changeContact);
contactsRouter.patch(
  "/:id/favorite",
  checkUpdateContactStatus,
  changeContactStatus
);

export default contactsRouter;
