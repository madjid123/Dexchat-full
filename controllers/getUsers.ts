
import { Request, Response, NextFunction } from "express";
import User from "../model/User"
import Room, { RoomType } from "../model/Room"
import mongoose from "mongoose";
import { PassportUserType } from "../config/Passport";

type Users = {
    users: mongoose.Types.ObjectId[]
}
// a recommendation system mockup

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reqUser = req.user as PassportUserType
        const user_id = req.params.user_id
        var pattern = req.query.pattern as string
        var friends = req.query.pattern as string

        if (pattern === undefined || pattern.length < 3) {
            pattern = ".*"
        }
        if (reqUser._id.toHexString() !== user_id) {
            throw new Error("Provided id is not the same as authenticated user id")
        }
        let rooms = await Room.find({ members: { $in: user_id } }, "members -_id")
        let connectedUsers: Users = { users: [] } as Users;
        rooms.map((room) => {
            room.members.map(member => {
                if (member.toHexString() !== user_id)
                    connectedUsers.users.push(member)
            })

        })
        connectedUsers.users.push(new mongoose.Types.ObjectId(user_id))
        var idFilter = {}
        if (friends === "true") {
            idFilter = {
                $in: connectedUsers.users
            }
        } else {
            idFilter = {
                $nin: connectedUsers.users
            }
        }


        const users = await User.find({
            _id: idFilter,
            username: {
                $in: [
                    // new RegExp(`^${pattern}`, "i"),
                    // new RegExp(`${pattern}$`, "i"),
                    new RegExp(`.*${pattern}.*`, "i"),
                ]
            }
        }, "_id username email")
        res.send({ users: users })

    } catch (e) {
        const err = e as Error
        console.error(err.message)
        res.status(500).send(err.message)
    }
}