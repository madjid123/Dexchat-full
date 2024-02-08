import { Request, Response } from "express";
import User, { UserType } from "../model/User";
import { body } from "express-validator";
import fs from "fs";
import path from "path";
import { sha256 } from "js-sha256";
import multer from "multer";
import mongoose from "mongoose";
const DEST_PATH = "public/images/users/";
const uploads = multer({
  preservePath: true,
  storage: multer.memoryStorage(),
});
export const avatarUploads = uploads.single("avatar");
export const modifyAvatarValidation =
  body("avatar", "Avatar must be an image of type jpg,png,svg,jpeg,svg").custom(
    (value, { req }) => {
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
    }
  );

export const modifyAvatarController = async (req: Request, res: Response) => {
  let session: mongoose.ClientSession | null = null;
  try {
    session = await mongoose.startSession();
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const user = await User.findById(req.params.user_id);
    if (user === null) return res.status(404).json({ message: "User not found" });
    session.startTransaction();


    if (!user) return res.status(404).json({ message: "User not found" });
    const imgPath = path.join(DEST_PATH, req.file.originalname);
    const oldimgPath = user.image;


    if (user.image && fs.existsSync(path.resolve(user.image))) {
      fs.unlinkSync(path.resolve(user.image));
    } else {
      fs.writeFileSync(imgPath, req.file.buffer);
      user.image = imgPath;
    }
    await user.save();
    await session.commitTransaction()
    return res.json({
      username: user.username,
      message: "Your profile was modified",
    });
  }
  catch (e) {
    await session?.abortTransaction(); // Use optional chaining to handle the case when 'session' is undefined
    const err = e as Error;
    console.error(err.message);
    res.status(500).json({ message: err.message });
  } finally {
    session?.endSession();
  }
};
