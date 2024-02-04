import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { PassportUserType } from "../config/Passport";
import Room from "../model/Room";
export const getRoomsHandlerFunction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = (req.user as PassportUserType)._id.toHexString()
        const { pattern } = req.query
        let p = ""
        if (pattern === undefined) {
            p = ".*"
        } else {
            p = pattern as string
        }
        const Pattern = new RegExp(`.*${p}.*`, "i")

        var rooms = await Room.find({
            members: { $in: [new mongoose.Types.ObjectId(id)] },
        }).populate("members", "username email ");
        rooms = rooms.filter(room => {
            let Member: any = room.members.find(member => {
                if (member._id.toHexString() !== id) {
                    return member
                }
            })
            Member = Member as { username: string, _id: string }
            return Pattern.test(Member.username)
        })
        res.json({
            Rooms: rooms,
        });
    } catch (err: any) {
        console.error(err);
        res.json({
            err: err.message,
        });
    }
};