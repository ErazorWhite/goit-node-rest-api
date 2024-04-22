import { Router } from "express";
import validateBody from "../helpers/validateBody.js";
import { registerUserSchema } from "../schemas/userSchemas.js";
import { registerUser } from "../controllers/userController.js";

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

// checkRegisterData, register
authRouter.post("/register", validateBody(registerUserSchema), registerUser);

// checkLoginData, login
authRouter.post("/login");
authRouter.post("/logout");
authRouter.get("/current");
authRouter.patch("/");

export default authRouter;