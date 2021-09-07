import { Response, Request, NextFunction } from "express";

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json("User is not authenticated");
  }
};
export default isAuth;
