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
    },
    phone: {
      type: String,
      minlength: [
        MINPHONE_L,
        `Phone should have at least ${MINPHONE_L} numbers`,
      ],
      match: Object.values(phoneRegexp), // Matches (XXX) XXX-XXXX OR XXX-XX-XX
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Включение меток времени
    versionKey: false, // Отключение ключа версии
  }
);

export const Contact = model("contacts", contactSchema);
