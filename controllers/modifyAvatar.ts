import { Request, Response } from "express";
import User from "../model/User";
import { body, validationResult } from "express-validator";
import fs from "fs";
import path from "path";
import { sha256 } from "js-sha256";
import multer from "multer";
import mongoose from "mongoose";
let DEST_PATH: string;
const IMAGE_PREFIX = "images/users";
if (process.env.NODE_ENV === "production") {
  DEST_PATH = `build/public/${IMAGE_PREFIX}`;
} else {
  DEST_PATH = `public/${IMAGE_PREFIX}`;
}
const uploads = multer({
  // preservePath: true,
  storage: multer.memoryStorage(),
});
export const avatarUploads = uploads.single("avatar");
export const modifyAvatarValidation = body(
  "avatar",
  "Avatar must be an image of type jpg,png,svg,jpeg,svg"
).custom((value, { req }) => {
  if (!req.file) {
    throw new Error("No file uploaded");
    return false;
  }
  const mimetypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/svg",
    "image/svg+xml",
  ];
  if (!mimetypes.includes(req.file.mimetype)) {
    throw new Error("File type not supported");
    return false;
  }
  return true;
});

export const modifyAvatarController = async (req: Request, res: Response) => {
  let session: mongoose.ClientSession | null = null;
  try {
    const validationResArray = validationResult(req).array();

    if (validationResArray.length > 0) {
      return res.status(400).json({
        errors: validationResArray.map((error) => {
          return error.msg;
        }),
      });
    }
    session = await mongoose.startSession();
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const user = await User.findById(req.params.user_id);
    if (user === null)
      return res.status(404).json({ errors: ["User not found"] });
    session.startTransaction();

    const filename =
      sha256(req.file.originalname) + path.extname(req.file.originalname);
    const imgPath = path.join(DEST_PATH, filename);
    const relativeImgPath = path.join(IMAGE_PREFIX, filename);
    const oldimgPath = user.image;

    console.log(relativeImgPath);
    console.log(path.resolve(imgPath));
    fs.writeFileSync(path.resolve(imgPath), req.file.buffer);
    if (oldimgPath && fs.existsSync(path.resolve(oldimgPath))) {
      fs.unlinkSync(path.resolve(oldimgPath));
    }

    user.image = relativeImgPath;
    await user.save();
    await session.commitTransaction();
    return res.json({
      username: user.username,
      message: "Your profile was modified",
    });
  } catch (e) {
    await session?.abortTransaction(); // Use optional chaining to handle the case when 'session' is undefined
    const error = e as Error;
    const errs = [error.message];
    console.error(error);
    return res.status(500).json({ errors: errs });
  } finally {
    session?.endSession();
  }
};
