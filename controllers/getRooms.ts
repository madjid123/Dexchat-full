import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { PassportUserType } from "../config/Passport";
import Room from "../model/Room";
import User from "../model/User";
export const getRoomsHandlerFunction = async (req: Request, res: Response) => {
  try {
    const id = (req.user as PassportUserType)._id.toHexString();
    const { pattern } = req.query;
    let p = "";
    if (pattern === undefined || pattern.length === 0) {
      p = ".*";
    } else {
      p = pattern as string;
    }
    const Pattern = new RegExp(`.*${p}.*`, "i");

    var rooms = await Room.find({
      members: { $in: [new mongoose.Types.ObjectId(id)] },
    }).populate<{
      members: Array<{
        _id: mongoose.Types.ObjectId;
        username: string;
        email: string;
        image?: string;
      }>;
    }>("members", "username email image ");
    rooms = rooms.filter((room) => {
      if (room.members.length >= 2) {
        return room.members.find((member) => {
          if (member._id.toHexString() !== id) {
            return Pattern.test(member.username);
          }
        });
      }
    });
    // rooms = rooms.filter(async (room) => {
    //   let Member = room.members.find(async (member) => {
    //     if (member._id.toHexString() !== id) {
    //       return member;
    //     }
    //     console.log((await User.findById(member._id)) == null);
    //   });
    //   return Pattern.test(Member!.username);
    // });
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
