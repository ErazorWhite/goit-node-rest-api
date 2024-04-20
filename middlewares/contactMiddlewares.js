import HttpError from "../helpers/HttpError.js";
import { Types } from "mongoose";

import { catchAsync } from "../helpers/catchAsync.js";

export const checkContactId = catchAsync(async (req, _res, next) => {
  const { id } = req?.params;

  const idIsValid = Types.ObjectId.isValid(id);

  if (!idIsValid) throw HttpError(400);

  next();
});
