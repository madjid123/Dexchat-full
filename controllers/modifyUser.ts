import { checkSchema, validationResult } from "express-validator";
import { Request, Response } from "express";
import User from "../model/User";
import { sha256 } from "js-sha256";

export interface TypedRequest extends Request {
  body: {
    username: string;
    email?: string;
    oldpassword: string;
    newpassword?: string;
  };
}

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
    if (!user) return res.status(404).json({ errors: ["User not found"] });
    let changedUsername = false;
    changedUsername = user.username !== username;
    user.username = username;

    if (!(await user.comparePassword(oldpassword!))) {
      return res.status(400).json({ errors: ["Invalid password"] });
    }
    user.email = email ? email : user.email;
    user.password = newpassword ? sha256(newpassword) : user.password;
    await user.save();
    return res.json({ username, message: "Your profile was modified" });
  } catch (e) {
    const error = e as Error;
    const errs = [error.message];
    console.error(error);
    return res.status(500).json({ errors: errs });
  }
};
