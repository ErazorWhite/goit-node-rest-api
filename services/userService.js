import { User } from "../models/userModel.js";
import { catchAsyncService } from "../helpers/catchAsync.js";
import { signToken } from "./jwtService.js";

export const registerUserService = catchAsyncService(async (userData) => {
  const newUser = await User.create(userData);

  newUser.password = undefined;

  const token = signToken(newUser.id);

  return { newUser, token };
});

export const checkUserExistsService = (email) => User.exists({ email });

