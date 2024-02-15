import express, { Router } from "express";
import { isAuth, isReqAuthorized } from "../utils/middlewares/middlewares";
import { getRoomsHandlerFunction } from "../controllers/getRooms";
import {
  TypedRequest,
  modifyUserController,
  validateModifyInputs,
} from "../controllers/modifyUser";
import { param, validationResult } from "express-validator";
import {
  avatarUploads,
  modifyAvatarController,
  modifyAvatarValidation,
} from "../controllers/modifyAvatar";
const app = express();
const router = Router({ mergeParams: true });

router.get("/rooms", getRoomsHandlerFunction);
router.post(
  "/modify/avatar",
  avatarUploads,
  modifyAvatarValidation,
  modifyAvatarController
);
router.post("/modify/profile", validateModifyInputs, modifyUserController);
app.use("/user/:user_id", isAuth, isReqAuthorized, (req, res, next) => {
  next();
});
app.use(
  "/user/:user_id",
  isAuth,
  param("user_id", "User ID must be a valid MongoDB ID")
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ID")
    .exists()
    .withMessage("User ID must be provided"),
  router
);
export default app;
