import bcrypt from "bcrypt";
import { catchAsyncService } from "../helpers/catchAsync.js";

export const hashPassword = catchAsyncService(async (password) => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  return passwordHash;
});

export const validatePassword = (password, passwordHash) =>
  bcrypt.compare(password, passwordHash);
