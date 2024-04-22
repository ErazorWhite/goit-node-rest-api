import HttpError from "../helpers/HttpError.js";
import { catchAsync } from "../helpers/catchAsync.js";
import {
  checkUserExistsService,
  registerUserService,
} from "../services/userService.js";

export const registerUser = catchAsync(async (req, res) => {
  const user = req.body;

  const userExists = await checkUserExistsService(user.email);
  if (userExists) throw HttpError(409, "Email in use");

  const { newUser, token } = await registerUserService(user);
  if (!newUser) throw HttpError();

  res.status(201).json({
    user: newUser,
    token,
  });
});
