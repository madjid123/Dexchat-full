
import { Request, Response, NextFunction } from "express";
import User from "../model/User"
const SearchForUserFunc = async (req: Request, res: Response, next: NextFunction) => {
    const pattern = req.params.pattern
    const similarUsers = await User.find({ username: "" })
}