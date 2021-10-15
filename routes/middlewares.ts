import { Response, Request, NextFunction } from "express";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() === true) {

    return next();
  } else {
    res.status(401).json("User is not authenticated");
  }
};

