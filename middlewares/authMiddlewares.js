import HttpError from "../helpers/HttpError.js";
import { catchAsync } from "../helpers/catchAsync.js";
import { checkToken } from "../services/jwtService.js";
import { getUserByIdService } from "../services/userService.js";

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
