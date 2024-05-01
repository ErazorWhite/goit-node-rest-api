import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";
import { User } from "../models/userModel.js";

/**
 * Converts payload into JWT
 * @param {string} id The unique identifier of the contact
 * @returns {string} JWT String
 */
export const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

/**
 * Verifies the token from the argument with the token from the database
 * @param {string} token - the token provided by the user
 * @returns {string} id - user ID
 */
export const checkToken = async (token) => {
  try {
    if (!token) throw HttpError(401);

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(id).select("token");
    if (!user || token !== user.token) throw HttpError(401);

    return id;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw HttpError(401, "Token expired, please login again");
    }

    throw error;
  }
};
