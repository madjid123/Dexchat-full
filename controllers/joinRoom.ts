import { Response, Request, NextFunction } from "express"
import mongoose from "mongoose"
import { PassportUserType } from "../config/Passport"
import JoinRoomRequest from "../model/JoinRoomRequest"
import Room from "../model/Room"

export const JoinRoomRequestFunction =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id = (req.user as PassportUserType)._id.toHexString()
            const { other_user_id } = req.params
            const requestExists = await JoinRoomRequest.exists({
                RequesterId: new mongoose.Types.ObjectId(user_id),
                ReceiverId: new mongoose.Types.ObjectId(other_user_id),
                State: { $nin: ["Rejected"] }

            })
            if (requestExists !== null) {
                res.status(404).send("request already exists")
                return;

            }
            const joinRoomRequest = new JoinRoomRequest({
                RequesterId: new mongoose.Types.ObjectId(user_id),
                ReceiverId: new mongoose.Types.ObjectId(other_user_id),
                State: "Pending"

            })
            await joinRoomRequest.save()
            res.send("request sent successfully")
        } catch (e) {
            const err = e as Error
            console.error(err.message)
            res.status(500).send(err.message)
        }
    }

export const JoinRoomAcceptRequestFunction =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id = (req.user as PassportUserType)._id.toHexString()
            const { other_user_id } = req.params
            const joinRoomRequest = await JoinRoomRequest.findOne({
                RequesterId: new mongoose.Types.ObjectId(other_user_id),
                ReceiverId: new mongoose.Types.ObjectId(user_id),
            })
            if (joinRoomRequest === null) {
                res.status(400).send("there is No such request with this params")
                return
            }
            if (joinRoomRequest.State !== "Pending")
                await joinRoomRequest.update(
                    { State: "Accepted" }
                )

            const newroom = new Room(
                {
                    members: [
                        new mongoose.Types.ObjectId(user_id),
                        new mongoose.Types.ObjectId(other_user_id)],
                }
            )
            await newroom.save()
            res.send("Accept Request Operation updated successfully")
        } catch (e) {
            const err = e as Error
            console.error(err)
            res.status(500).send(err)
        }

    }

export const JoinRoomRejectRequestFunction =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id = (req.user as PassportUserType)._id.toHexString()
            const { other_user_id } = req.params
        } catch (e) {
            const err = e as Error
            console.error(err)
            res.status(500).send(err)
        }

    }

export const JoinRoomRemoveRequestFunction =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id = (req.user as PassportUserType)._id.toHexString()
            const { other_user_id } = req.params

        } catch (e) {
            const err = e as Error
            console.error(err)
            res.status(500).send(err)
        }
    }
