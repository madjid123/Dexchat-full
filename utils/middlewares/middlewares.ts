import { Response, Request, NextFunction } from "express";
import { PassportUserType } from "../../config/Passport";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() === true) {

    return next();
  } else {
    res.status(401).json("User is not authenticated");
  }
};

export const isReqAuthorized = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.params.user_id !== (req.user as PassportUserType)._id.toHexString()) {
      res.status(500).send("Operation not allowed for this user")
      return;
    }
    next()
  } catch (e) {
    const err = e as Error
    console.error(err)
  }
}