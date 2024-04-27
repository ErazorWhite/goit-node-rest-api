import { Router } from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  changeContact,
  changeContactStatus,
} from "../controllers/contactsControllers.js";
import { checkContactId } from "../middlewares/contactMiddlewares.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
} from "../schemas/contactsSchemas.js";
import { protect } from "../middlewares/authMiddlewares.js";

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

contactsRouter.use(protect);

contactsRouter.get("/", getAllContacts);
contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.use("/:id", checkContactId);

contactsRouter.get("/:id", getOneContact);
contactsRouter.delete("/:id", deleteContact);
contactsRouter.put("/:id", validateBody(updateContactSchema), changeContact);
contactsRouter.patch(
  "/:id/favorite",
  validateBody(updateContactStatusSchema),
  changeContactStatus
);

export default contactsRouter;
