import { Response, Request, NextFunction } from "express"
import mongoose from "mongoose"
import JoinRoomRequest from "../model/JoinRoomRequest"

export const JoiningRoomRequestFunction =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_id, other_user_id } = req.params
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