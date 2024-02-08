import {
  ValidationError,
  body,
  checkSchema,
  param,
  validationResult,
} from "express-validator";
import { NextFunction, Request, Response } from "express";
import User from "../model/User";
import multer from "multer";
import fs from "fs";
import path from "path";
import { sha256 } from "js-sha256";
import { SessionData } from "express-session";

export interface TypedRequest extends Request {
  body: {
    username: string;
    email?: string;
    oldpassword: string;
    newpassword?: string;
  };
}
// export const validateModifyInputs = [
//   body("username", "Username length must be a string of at least 3 characters")
//     .isString()
//     .withMessage("Username must be a string")
//     .isLength({ min: 3 })
//     .withMessage("Username must be at least 3 characters long"),
//   body("oldpassword", "Password be a string of at least 6 characters ")
//     .isString()
//     .withMessage("Password must be a string")
//     .isLength({ min: 6 })
//     .withMessage("Password must be at least 6 characters long")
//     .exists(),
//   body("newpassword", "New Password be a string of at least 6 characters ")
//     .isString()
//     .withMessage("New Password must be a string")
//     .isLength({ min: 6 })
//     .withMessage("New Password must be at least 6 characters long")
//     .optional(),
// ];
export const validateModifyInputs = checkSchema({
  username: {
    isString: true,
    isLength: { options: { min: 3 } },
    exists: true,
    errorMessage: "Username must have at least 3 characters",
  },
  email: {
    isEmail: true,
    optional: true,
    errorMessage: "Username must have at least 3 characters",
  },

  oldpassword: {
    errorMessage: "Password be a string of at least 6 characters ",
    isString: true,
    isLength: { options: { min: 6 } },
    exists: true,
  },
  newpassword: {
    errorMessage: "Password be a string of at least 6 characters ",
    isString: true,
    isLength: { options: { min: 6 } },
    optional: true,
  },
  //     .withMessage("Password must be at least 6 characters long")
  //     .exists(),
});
export const modifyUserController = async (
  req: TypedRequest,
  res: Response
) => {
  try {
    const { username, email, oldpassword, newpassword } = req.body;
    const validationResArray = validationResult(req).array();

    if (validationResArray.length > 0) {
      return res.status(400).json({
        errors: validationResArray.map((error) => {
          return error.msg;
        }),
      });
    }
    const user = await User.findById(req.params.user_id);
    if (!user) return res.status(404).json({ message: "User not found" });
    let changedUsername = false;
    changedUsername = user.username !== username;
    user.username = username;

    if (!(await user.comparePassword(oldpassword!))) {
      return res.status(400).json({ message: "Invalid password" });
    }
    user.email = email ? email : user.email;
    user.password = newpassword ? sha256(newpassword) : user.password;
    await user.save();
    const sessionStore = req.sessionStore;
    if (sessionStore.clear && newpassword !== undefined) {
      req.session.regenerate((err) => {
        if (err) throw new Error(err);
        (req.session as any).user = { username, email, _id: user._id };
        req.session.save((err) => {
          if (err) throw new Error(err);
        });
      })
    }
    if (changedUsername && sessionStore.all !== undefined) {
      // await req.sessionStore.destroy(req.sessionID);

    }
    return res.json({ username, message: "Your profile was modified" });
  } catch (e) {
    const error = e as Error;
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
