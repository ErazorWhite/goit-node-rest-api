import { model, Schema } from "mongoose";
import validator from "validator";

import { phoneRegexp } from "../constants/regexp.js";
import { MAXNAME_L, MINNAME_L, MINPHONE_L } from "../constants/customValues.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [
        MINNAME_L,
        `Name should have at least ${MINNAME_L} characters`,
      ],
      maxlength: [
        MAXNAME_L,
        `Name should have no more than ${MAXNAME_L} characters`,
      ],
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      validate: [validator.isEmail, "Invalid email address"],
      unique: true,
    },
    phone: {
      type: String,
      minlength: [
        MINPHONE_L,
        `Phone should have at least ${MINPHONE_L} numbers`,
      ],
      match: [phoneRegexp.BOTH, "Please fill a valid phone number"], // Matches (XXX) XXX-XXXX OR XXX-XX-XX
      unique: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Contact = model("contacts", contactSchema);
