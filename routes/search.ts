import { Router } from "express";
import { isAuth } from "./middlewares"

const router = Router();
router.get("/search", isAuth, async (req, res) => {

})
