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
import {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
} from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";

const contactsRouter = Router();

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
