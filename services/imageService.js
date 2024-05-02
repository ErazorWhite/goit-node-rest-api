import multer from "multer";
import Jimp from "jimp";
import path from "path";
import * as fse from "fs-extra";
import { v4 } from "uuid";

import { MB_SIZE, defaultAvatarSize } from "../constants/customValues.js";
import HttpError from "../helpers/HttpError.js";

export class ImageService {
  static initUploadImageMiddleware(fieldName) {
    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, cbk) => {
      if (file.mimetype.startsWith("image/")) {
        cbk(null, true);
      } else {
        cbk(new HttpError(400, "Please, upload images only.."), false);
      }
    };

    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    }).single(fieldName);
  }

  static async saveImage(file, options, ...pathSegments) {
    if (
      file.size >
      (options?.maxFileSize ? options.maxFileSize * MB_SIZE : 1 * MB_SIZE)
    ) {
      throw HttpError(400, "File is too large..");
    }

    const fileName = `${options.userId ?? v4()}.jpeg`;
    const tmpFilePath = path.join(process.cwd(), "tmp"); // temp path

    await fse.ensureDir(tmpFilePath); // check temp path

    const { WIDTH, HEIGHT } = defaultAvatarSize; // def sizes

    const image = await Jimp.read(file.buffer); // read
    image.cover(options?.width ?? WIDTH, options?.height ?? HEIGHT).quality(90); // change
    await image.writeAsync(path.join(tmpFilePath, fileName)); // write

    const fullFilePath = path.join(process.cwd(), "public", ...pathSegments); // new path
    await fse.ensureDir(fullFilePath); // check new path
    await fse.move(
      path.join(tmpFilePath, fileName),
      path.join(fullFilePath, fileName),
      { overwrite: true }
    ); // move temp -> new path

    return path.join(...pathSegments, fileName);
  }
}
