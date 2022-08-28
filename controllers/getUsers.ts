
import { Request, Response, NextFunction } from "express";
import User, { UserType } from "../model/User"
import Room, { RoomType } from "../model/Room"
import mongoose from "mongoose";
import { PassportUserType } from "../config/Passport";
import JoinRoomRequest from "../model/JoinRoomRequest";
import { request } from "https";

type Users = {
    users: mongoose.Types.ObjectId[]
}
// a recommendation system mockup
type UserTypeExt = UserType & {
    pendingRequest: boolean,
    to: boolean
}
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reqUser = req.user as PassportUserType
        const user_id = req.params.user_id
        var pattern = req.query.pattern as string
        var requests = req.query.requests as string

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
        var idFilter = {
            $nin: connectedUsers.users
        }


        var users = await User.find({
            _id: idFilter,
            username: {
                $in: [
                    new RegExp(`.*${pattern}.*`, "i"),
                ]
            }
        }, "_id username email").lean()
        var Users = users.map
            (async (User) => {
                var user: UserTypeExt & { _id: any } = User as UserTypeExt & { _id: any }
                const joinRequestFromThisUser = await JoinRoomRequest.exists(
                    {

                        RequesterId: reqUser._id,
                        ReceiverId: User._id,
                        State: "Pending"
                    }
                )
                const joinRequestToThisUser = await JoinRoomRequest.exists(
                    {

                        RequesterId: User._id,
                        ReceiverId: reqUser._id,
                        State: "Pending"
                    }
                )
                if (joinRequestFromThisUser !== null || joinRequestToThisUser !== null) {
                    if (joinRequestToThisUser !== null) {
                        user.pendingRequest = true
                        user.to = true
                    } else {
                        user.pendingRequest = true
                        user.to = false
                    }
                } else {
                    user.pendingRequest = false
                    user.to = false

                }
                return user
            });
        users = await Promise.all(Users)
        res.send({ users: users })

    } catch (e) {
        const err = e as Error
        console.error(err.message)
        res.status(500).send(err.message)
    }
}