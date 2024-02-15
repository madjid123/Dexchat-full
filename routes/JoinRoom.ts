import express from "express"
import { PassportUserType } from "../config/Passport"
import {
    JoinRoomRequestFunction,
    JoinRoomRemoveRequestFunction,
    JoinRoomAcceptRequestFunction,
    JoinRoomRejectRequestFunction,
    getJoinRoomRequestsFunction
} from "../controllers/joinRoom"
import { isAuth } from "../utils/middlewares/middlewares"

export const app = express()
const router = express.Router()

router.get("/request/:other_user_id", JoinRoomRequestFunction)
router.get("/accept/:other_user_id", JoinRoomAcceptRequestFunction)
router.get("/reject/:other_user_id", JoinRoomRejectRequestFunction)
router.delete("/remove/:other_user_id", JoinRoomRemoveRequestFunction)
router.get("/getrequests", getJoinRoomRequestsFunction)
app.use("/join_room/:user_id", isAuth, async (req, res, next) => {
    try {
        if (req.params.user_id !== (req.user as PassportUserType)._id.toHexString()) {
            res.status(500).send("Operation not allowed for this user")
            return;
        }
        next()
    } catch (e) {
        const err = e as Error
        console.error(err)
    }
})
app.use("/join_room/:user_id", router)
export default app
