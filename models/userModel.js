import { model, Schema } from "mongoose";
import validator from "validator";
import gravatar from "gravatar";

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
  avatarURL: String,
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
});

// Pre-save hook fires on "save" and "create" methods
userSchema.pre("save", async function (next) {
  if (this.isNew)
    this.avatarURL = gravatar.url(this.email, { d: "robohash" }, false);

  if (!this.isModified("password")) return next();

  this.password = await hashPassword(this.password);

  next();
});

// Middleware that dynamically changes verificationToken validation
userSchema.pre("validate", function (next) {
  if (this.verify) {
    // If the user is verified, remove the requirement for verificationToken
    this.constructor.schema.path("verificationToken").required(false);
  } else {
    // If the user is not verified, leave verificationToken as a required field
    this.constructor.schema.path("verificationToken").required(true);
  }
  next();
});

userSchema.methods.checkUserPassword = (candidate, passwordHash) =>
  validatePassword(candidate, passwordHash);

export const User = model("users", userSchema);
