import { User } from "../models/userModel.js";
import { catchAsyncService } from "../helpers/catchAsync.js";
import { signToken } from "./jwtService.js";

export const registerUserService = catchAsyncService(async (userData) => {
  const { email, subscription } = await User.create(userData);

  return { email, subscription };
});

export const checkUserExistsService = (email) => User.exists({ email });

export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) return null;

  const isPasswordValid = await user.checkUserPassword(password, user.password);
  if (!isPasswordValid) return null;

  const token = signToken(user.id);

  return {
    user: { email: user.email, subscription: user.subscription },
    token,
  };
};

export const getUserByIdService = (id) => User.findById(id);
