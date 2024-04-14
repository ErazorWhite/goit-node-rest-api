import { Router } from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";
import { checkContactId } from "../middlewares/contactMiddlewares.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";

const contactsRouter = Router();
contactsRouter
  .route("/")
  .post(validateBody(createContactSchema), createContact)
  .get(getAllContacts);
contactsRouter.use("/:id", checkContactId);
contactsRouter
  .route("/:id")
  .get(getOneContact)
  .put(validateBody(updateContactSchema), updateContact)
  .delete(deleteContact);

export default contactsRouter;
