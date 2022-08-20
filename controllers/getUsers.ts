
import { Request, Response, NextFunction } from "express";
import User from "../model/User"
import Room, { RoomType } from "../model/Room"
import mongoose from "mongoose";
import { PassportUserType } from "../config/Passport";
// implements a response to /search "GET" request
export const SearchForUserFunc = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pattern = req.query.pattern
        let p = ""
        if (pattern === undefined) {
            p = ".*"
        } else
            p = pattern as string
        const similarUsers = await User.find({
            username: {
                $in: [
                    new RegExp(`^${p}`, "i"),
                    new RegExp(`${p}$`, "i"),
                    new RegExp(`.*${p}.*`, "i"),
                ]
            }
        }, "username email")
        if (similarUsers.length === 0) {
            res.status(404).send('No such user similar to this username')
            return
        }
        res.status(200).send({ users: similarUsers })
    } catch (e: any) {
        const err = e as Error
        console.error(err)
        res.status(500).send(err)
    }

}
type Users = {
    users: mongoose.Types.ObjectId[]
}
// a recommendation system mockup

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reqUser = req.user as PassportUserType
        const user_id = req.params.user_id
        var pattern = req.query.pattern as string
        if (pattern === undefined || pattern.length < 3) {
            pattern = ".*"
        }

        if (reqUser._id.toHexString() !== user_id) {
            throw new Error("Provided id is not the same as authenticated user id")
        }
        let rooms = await Room.find({ members: { $in: user_id } }, "members -_id")
        let nonConnectedUsers: Users = { users: [] } as Users;
        rooms.map((room) => {
            room.members.map(member => {
                if (member.toHexString() !== user_id)
                    nonConnectedUsers.users.push(member)
            })

        })
        nonConnectedUsers.users.push(new mongoose.Types.ObjectId(user_id))
        const users = await User.find({
            _id: { $nin: nonConnectedUsers.users },
            username: {
                $in: [
                    new RegExp(`^${pattern}`, "i"),
                    new RegExp(`${pattern}$`, "i"),
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