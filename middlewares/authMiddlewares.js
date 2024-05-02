import multer from "multer";
import path from "path";

import HttpError from "../helpers/HttpError.js";
import { catchAsync } from "../helpers/catchAsync.js";
import { checkToken } from "../services/jwtService.js";
import { getUserByIdService } from "../services/userService.js";
import { v4 } from "uuid";
import { MB_SIZE } from "../constants/customValues.js";

export const protect = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer ") &&
    req.headers.authorization.split(" ")[1];

  const userId = await checkToken(token);
  if (!userId) throw HttpError(401);

  const currentUser = await getUserByIdService(userId);
  if (!currentUser) throw HttpError(401);

  req.user = currentUser;

  next();
});

// MULTER
// config storage
const multerStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join("public", "avatars"));
  },
  filename: (req, file, callback) => {
    const extension = file.mimetype.split("/")[1];

    callback(null, `${req.user.id}-${v4()}.${extension}`);
  },
});

// config filter
const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image/")) {
    callback(null, true);
  } else {
    callback(HttpError(400, "Please upload images only"), false);
  }
};

// create middleware
export const uploadAvatar = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fieldSize: 2 * MB_SIZE,
  },
}).single('avatar');
