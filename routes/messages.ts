import express from "express"
import { getMessages } from "../controllers/messages"
import { isAuth } from "../utils/middlewares/middlewares"
const router = express.Router()
const app = express()

router.get("/room/:room_id", [isAuth], getMessages)

app.use("/messages", router)
module.exports = app