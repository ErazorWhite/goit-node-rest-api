import { Router } from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";
import { checkContactId } from "../middlewares/contactMiddlewares.js";

const contactsRouter = Router();

contactsRouter.route("/").post(createContact).get(getAllContacts);
contactsRouter.use("/:id", checkContactId);
contactsRouter
  .route("/:id")
  .get(getOneContact)
  .patch(updateContact)
  .delete(deleteContact);

export default contactsRouter;
