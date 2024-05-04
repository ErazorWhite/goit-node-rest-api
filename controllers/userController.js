import { v4 } from "uuid";

import HttpError from "../helpers/HttpError.js";
import { catchAsync } from "../helpers/catchAsync.js";
import {
  checkUserExistsService,
  findUserByEmailService,
  loginUserService,
  logoutUserService,
  registerUserService,
  updateCurrentUserAvatarService,
  updateSubscriptionUserService,
  verifyUserByVerificationToken,
} from "../services/userService.js";
import { EmailService } from "../services/emailService.js";

export const registerUser = catchAsync(async (req, res) => {
  const user = req.body;

  const userExists = await checkUserExistsService(user.email);
  if (userExists) throw HttpError(409, "Email in use");

  user.verificationToken = v4();

  const newUser = await registerUserService(user);
  if (!newUser) throw HttpError(500);

  const verificationURL = `${process.env.BASE_URL}/users/verify/${user.verificationToken}`;

  const emailService = new EmailService(newUser, verificationURL);
  await emailService.sendVerificationEmail(verificationURL);

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

export const updateSubscriptionUser = catchAsync(async (req, res) => {
  const { id } = req.user;

  const newUserSubscription = await updateSubscriptionUserService(
    id,
    req.body.subscription
  );
  if (!newUserSubscription) throw HttpError(401);

  res.status(201).json({
    user: newUserSubscription,
  });
});

export const currentUser = (req, res) => {
  res.status(200).json({
    user: { email: req.user.email, subscription: req.user.subscription },
  });
};

export const updateCurrentUser = catchAsync(async (req, res) => {
  const updatedUser = await updateCurrentUserAvatarService(req.user, req.file);
  res.status(200).json({
    avatarURL: updatedUser.avatarURL,
  });
});

export const verifyToken = catchAsync(async (req, res) => {
  const { verificationToken } = req.params;
  const user = await verifyUserByVerificationToken(verificationToken);

  if (!user) throw HttpError(404, "User not found");

  res.status(200).json({ message: "Verification successful" });
});

export const resendVerificationEmail = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) throw HttpError(400, "Missing required field email");

  const user = await findUserByEmailService(email);

  if (!user) throw HttpError(404, "User not found");

  if (user.verify) throw HttpError(400, "Verification has already been passed");

  const verificationURL = `${process.env.BASE_URL}/users/verify/${user.verificationToken}`;

  const emailService = new EmailService(user, verificationURL);
  await emailService.sendVerificationEmail(verificationURL);

  res.status(200).json({ message: "Verification email sent" });
});
