import { User } from "../models/userModel.js";
import { catchAsyncService } from "../helpers/catchAsync.js";
import { signToken } from "./jwtService.js";
import HttpError from "../helpers/HttpError.js";

export const registerUserService = catchAsyncService(async (userData) => {
  const { email, subscription } = await User.create(userData);

  return { email, subscription };
});

export const checkUserExistsService = (email) => User.exists({ email });

export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw HttpError(401);

  const isPasswordValid = await user.checkUserPassword(password, user.password);
  if (!isPasswordValid) throw HttpError(401);

  const token = signToken(user.id);

  user.token = token;
  await user.save();

  return {
    user: { email: user.email, subscription: user.subscription },
    token,
  };
};

export const logoutUserService = async (id) => {
  const deleteToken = await User.findByIdAndUpdate(
    { _id: id },
    { token: null }
  );

  return deleteToken;
};

export const getUserByIdService = (id) => User.findById(id);
