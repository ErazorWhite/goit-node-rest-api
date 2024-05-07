import { User } from "../models/userModel.js";
import { catchAsyncService } from "../helpers/catchAsync.js";
import { signToken } from "./jwtService.js";
import HttpError from "../helpers/HttpError.js";
import { ImageService } from "./imageService.js";
import { defaultAvatarSize } from "../constants/customValues.js";
import { v4 } from "uuid";

/**
 * Register a new user.
 * @param {Object} userData - Object containing the user's email and password.
 * @param {string} userData.email - User's email.
 * @param {string} userData.password - User's password.
 * @returns {Object} Object containing the user's email and subscription.
 * @returns {string} Object.email - User's email.
 * @returns {string} Object.subscription - User's subscription status.
 * @author Oleksii
 * @category services
 */
export const registerUserService = catchAsyncService(async (userData) => {
  const { email, subscription } = await User.create(userData);

  return { email, subscription };
});

/**
 * Check if a user exists by email.
 * @param {string} email - Email of the user to check.
 * @returns {Promise<boolean>} A promise that resolves to true if the user exists, otherwise false.
 * @author Oleksii
 * @category services
 */
export const checkUserExistsService = (email) => User.exists({ email });

/**
 * User login service.
 * Authenticates a user with provided credentials.
 * @param {Object} credentials - Object containing the user's email and password.
 * @param {string} credentials.email - User's email.
 * @param {string} credentials.password - User's password.
 * @returns {Object} Object containing the user's email and subscription.
 * @returns {string} Object.email - User's email.
 * @returns {string} Object.subscription - User's subscription status.
 * @returns {string} token - Authentication token.
 * @author Oleksii
 * @category services
 */
export const loginUserService = catchAsyncService(
  async ({ email, password }) => {
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw HttpError(401);

    if (!user.verify) throw HttpError(401, "Please verify your email");

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

/**
 * Logout a user by removing their authentication token.
 * @param {string} id - User ID.
 * @returns {Promise<Object>} The user document after removing the token.
 * @author Oleksii
 * @category services
 */
export const logoutUserService = catchAsyncService(async (id) => {
  const deleteToken = await User.findByIdAndUpdate(
    { _id: id },
    { token: null }
  );

  return deleteToken;
});

/**
 * Get user by ID.
 * @param {string} id - User ID.
 * @returns {Promise<User|null>} A promise resolving to the user document, or null if not found.
 * @author Oleksii
 * @category services
 */
export const getUserByIdService = (id) => User.findById(id);

/**
 * Get user by email.
 * @param {string} email - User email.
 * @returns {Promise<User|null>} A promise resolving to the user document, or null if not found.
 * @author Oleksii
 * @category services
 */
export const findUserByEmailService = (email) => User.findOne({ email });

/**
 * Update user subscription by ID.
 * @param {string} id - User ID.
 * @param {string} subscription - New subscription status.
 * @returns {Promise<Object|null>} A promise resolving to the updated user document, or null if not found.
 * @author Oleksii
 * @category services
 */
export const updateSubscriptionUserService = (id, subscription) =>
  User.findByIdAndUpdate(
    { _id: id },
    { subscription },
    { new: true, select: "email subscription" }
  );

/**
 * Update current user's avatar.
 * @param {Object} user - User object.
 * @param {Object} file - File object representing the new avatar image.
 * @returns {Promise<User>} A promise resolving to the updated user document with the new avatar URL.
 * @throws {Error} If there's an issue saving the image or updating the user.
 * @author Oleksii
 * @category services
 */
export const updateCurrentUserAvatarService = catchAsyncService(
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

/**
 * Verify user by verification token
 * @param {string} verificationToken - Verification Token
 * @returns {Promise<User|null>} - User or `null` if not found
 */
export const verifyUserByVerificationToken = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });

  if (!user) return null;

  user.verificationToken = null;
  user.verify = true;

  return user.save({ new: true });
};
