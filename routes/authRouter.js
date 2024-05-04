import { Router } from "express";
import validateBody from "../helpers/validateBody.js";
import {
  loginUserSchema,
  registerUserSchema,
  sendVerificationEmailSchema,
  subscriptionUserSchema,
} from "../schemas/userSchemas.js";
import {
  currentUser,
  loginUser,
  logoutUser,
  registerUser,
  resendVerificationEmail,
  updateCurrentUser,
  updateSubscriptionUser,
  verifyToken,
} from "../controllers/userController.js";
import { protect, uploadAvatar } from "../middlewares/authMiddlewares.js";

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

authRouter.get("/verify/:verificationToken", verifyToken);
authRouter.post("/verify", validateBody(sendVerificationEmailSchema), resendVerificationEmail);

authRouter.use(protect);

authRouter.post("/logout", logoutUser);
authRouter.get("/current", currentUser);
authRouter.patch("/avatars", uploadAvatar, updateCurrentUser);
authRouter.patch(
  "/",
  validateBody(subscriptionUserSchema),
  updateSubscriptionUser
);

export default authRouter;
