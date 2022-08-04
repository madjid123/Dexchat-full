import { Router } from "express";
import { isAuth } from "./middlewares"
import { SearchForUserFunc } from "../controllers/search"
const router = Router();
router.get("/search", isAuth, SearchForUserFunc
)
module.exports = router
