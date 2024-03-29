import express, { Router } from "express";
import { isAuth } from "../utils/middlewares/middlewares"
import { getAllUsers } from "../controllers/getUsers"

const app = express()
const router = Router();
router.get("/:user_id/getallusers", isAuth, getAllUsers)
app.use("/search", router)
export default app

