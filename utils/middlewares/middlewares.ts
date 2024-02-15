import { Response, Request, NextFunction } from "express";
import passport, { PassportUserType } from "../../config/Passport";
import jwt from "jsonwebtoken";
import User from "../../model/User";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    passport.authenticate("jwt", { session: false })(req, res, next);
  } catch (e) {
    const err = e as Error;
    console.error(err);
    res.status(401).json("User is not authenticated");
  }
};

export const isReqAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      req.params.user_id !== (req.user as PassportUserType)._id.toHexString()
    ) {
      res.status(500).send(["Operation not allowed for this user"]);
      return;
    }
    next();
  } catch (e) {
    const err = e as Error;
    console.error(err);
    res.status(401).json(["This operation  is not allowed for this User"]);
  }
};
