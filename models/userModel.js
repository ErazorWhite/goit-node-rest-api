import { model, Schema } from "mongoose";
import validator from "validator";

import { subscriptionType } from "../constants/customValues.js";
import { PASSWD_REGEX } from "../constants/regexp.js";
import { hashPassword, validatePassword } from "../services/passwordService.js";

const userSchema = new Schema({
  password: {
    type: String,
    math: [
      PASSWD_REGEX,
      "Password should have from 8 to 128 characters, at least one upper case letter (A-Z), at least one lower case letter (a-z), at least one digit (0-9), at least one special character.",
    ],
    required: [true, "Password is required"],
    select: false,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: [validator.isEmail, "Invalid email address"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: Object.values(subscriptionType),
    default: subscriptionType.STARTER,
  },
  token: {
    type: String,
    default: null,
  },
});

// Pre-save hook fires on "save" and "create" methods
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await hashPassword(this.password);

  next();
});

userSchema.methods.checkUserPassword = (candidate, passwordHash) =>
  validatePassword(candidate, passwordHash);

export const User = model("users", userSchema);
