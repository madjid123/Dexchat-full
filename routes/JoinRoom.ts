import express from "express"
import { JoiningRoomRequestFunction } from "../controllers/joinRoom"
import { isAuth } from "./middlewares"

const app = express()
const router = express.Router()
router.get("/:user_id/request/:other_user_id", isAuth, JoiningRoomRequestFunction)
router.get("/:user_id/accept/:other_user_id", isAuth, () => { })
router.get("/:user_id/reject/:other_user_id", isAuth, () => { })
app.use("/join_room", router)
module.exports = app