import { Router } from "express";
import validateBody from "../helpers/validateBody.js";
import {
  loginUserSchema,
  registerUserSchema,
  subscriptionUserSchema,
} from "../schemas/userSchemas.js";
import {
  currentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateSubscriptionUser,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddlewares.js";

const authRouter = Router();

/**
 * REST api (Create, Read, Update, Delete)
 * POST, GET, PUT, DELETE, PATCH
 *
 * POST         /users/register
 * POST         /users/login
 * POST         /users/logout
 * GET          /users/current
 * PATCH        /users
 *
 */

authRouter.post("/register", validateBody(registerUserSchema), registerUser);
authRouter.post("/login", validateBody(loginUserSchema), loginUser);
authRouter.post("/logout", protect, logoutUser);
authRouter.get("/current", protect, currentUser);
authRouter.patch(
  "/",
  protect,
  validateBody(subscriptionUserSchema),
  updateSubscriptionUser
);

export default authRouter;
