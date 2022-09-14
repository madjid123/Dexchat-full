import express, { Router } from "express";
import { isAuth, isReqAuthorized } from "../utils/middlewares/middlewares"
import { getRoomsHandlerFunction } from "../controllers/getRooms";
const app = express()
const router = Router()


router.get("/rooms", getRoomsHandlerFunction)
app.use("/user/:user_id", isAuth, isReqAuthorized)
app.use("/user/:user_id", isAuth, router);
module.exports = app
