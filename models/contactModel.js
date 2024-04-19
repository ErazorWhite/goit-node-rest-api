import { model, Schema } from "mongoose";
import { phoneRegexp } from "../constants/regexp";

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    match: Object.values(phoneRegexp), // Matches (XXX) XXX-XXXX
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

export const Contact = model('Contact', contactSchema)