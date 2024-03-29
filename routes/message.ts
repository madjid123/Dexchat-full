import express from "express"
import { getMessages } from "../controllers/messages"
import { RoomSendMessage } from "../controllers/room"
import { isAuth } from "../utils/middlewares/middlewares"
const router = express.Router()
const app = express()

router.post("/:room_id/send/message", isAuth, RoomSendMessage)


app.use("/room", router)
export default app