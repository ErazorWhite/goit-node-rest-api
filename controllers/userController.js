import HttpError from "../helpers/HttpError.js";
import { catchAsync } from "../helpers/catchAsync.js";
import {
  checkUserExistsService,
  loginUserService,
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
  const { user, token } = await loginUserService(req.body);
  if (!user || !token) throw HttpError(401);

  res.status(200).json({
    user,
    token,
  });
});

export const currentUser = (req, res) => {
  res.status(200).json({
    user: { email: req.user.email, subscription: req.user.subscription },
  });
};
