import { User } from "../models/userModel.js";
import { catchAsyncService } from "../helpers/catchAsync.js";
import { signToken } from "./jwtService.js";
import HttpError from "../helpers/HttpError.js";
import { ImageService } from "./imageService.js";
import { defaultAvatarSize } from "../constants/customValues.js";

export const registerUserService = catchAsyncService(async (userData) => {
  const { email, subscription } = await User.create(userData);

  return { email, subscription };
});

export const checkUserExistsService = (email) => User.exists({ email });

export const loginUserService = catchAsyncService(
  async ({ email, password }) => {
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw HttpError(401);

    const isPasswordValid = await user.checkUserPassword(
      password,
      user.password
    );
    if (!isPasswordValid) throw HttpError(401);

    const token = signToken(user.id);

    user.token = token;
    await user.save();

    return {
      user: { email: user.email, subscription: user.subscription },
      token,
    };
  }
);

export const logoutUserService = catchAsyncService(async (id) => {
  const deleteToken = await User.findByIdAndUpdate(
    { _id: id },
    { token: null }
  );

  return deleteToken;
});

export const getUserByIdService = (id) => User.findById(id);

export const updateSubscriptionUserService = (id, subscription) =>
  User.findByIdAndUpdate(
    { _id: id },
    { subscription },
    { new: true, select: "email subscription" }
  );

export const updateCurrentUserService = catchAsyncService(
  async (user, file) => {
    if (file) {
      const { WIDTH, HEIGHT } = defaultAvatarSize;
      user.avatarURL = await ImageService.saveImage(
        file,
        {
          maxFileSize: 2,
          width: WIDTH,
          height: HEIGHT,
          userId: user.id,
        },
        "avatars"
      );
    }

    return user.save();
  }
);
