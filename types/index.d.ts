// import { Express, Request } from "express";
// import { Multer, File } from "multer";
declare namespace Express {
  export interface Request {
    file?: Express.Multer.File; // Replace 'any' with the actual type if known
    user?: {
      _id: string;
      username: string;
      email: string;
      image?: string;
    };
  }
}
