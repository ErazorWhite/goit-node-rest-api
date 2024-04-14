import { Router } from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  changeContact,
} from "../controllers/contactsControllers.js";
import { checkContactId } from "../middlewares/contactMiddlewares.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";

const contactsRouter = Router();

contactsRouter.get("/", getAllContacts);
contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.use("/:id", checkContactId);

contactsRouter.get("/:id", getOneContact);
contactsRouter.delete("/:id", deleteContact);
contactsRouter.put("/:id", validateBody(updateContactSchema), changeContact);

export default contactsRouter;
