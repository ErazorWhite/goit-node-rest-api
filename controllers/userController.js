import HttpError from "../helpers/HttpError.js";
import { catchAsync } from "../helpers/catchAsync.js";
import {
  checkUserExistsService,
  loginUserService,
  logoutUserService,
  registerUserService,
} from "../services/userService.js";

export const registerUser = catchAsync(async (req, res) => {
  const user = req.body;

  const userExists = await checkUserExistsService(user.email);
  if (userExists) throw HttpError(409, "Email in use");

  const newUser = await registerUserService(user);
  if (!newUser) throw HttpError(500);

  res.status(201).json({
    user: newUser,
  });
});

export const loginUser = catchAsync(async (req, res) => {
  const loginResult = await loginUserService(req.body);
  if (!loginResult) throw HttpError(401);

  const { user, token } = loginResult;

  res.status(200).json({
    user,
    token,
  });
});

export const logoutUser = catchAsync(async (req, res) => {
  const { id } = req.user;
  const logoutResult = await logoutUserService(id);
  if (!logoutResult) throw HttpError(401);

  res.status(204).end();
});

export const currentUser = (req, res) => {
  res.status(200).json({
    user: { email: req.user.email, subscription: req.user.subscription },
  });
};
