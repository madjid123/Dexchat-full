import { Router } from "express";
import User from "../model/User";
import { sha256 } from "js-sha256";
import { body, validationResult } from "express-validator"
import { RegisterHandlerFunction } from "../controllers/register";
const app = Router()
app.post("/register",
  body("email").isEmail().normalizeEmail().custom(async value => {
    const exists = await User.exists({ email: value })
    if (exists) {
      return Promise.reject("Email already in use !")
    }

  }),
  body("username").notEmpty().isAlphanumeric().trim().custom(async value => {
    const exists = await User.exists({ username: value })
    if (exists) {
      return Promise.reject("Username already in use !")
    }

  }),
  body("password").isLength({ min: 6 })
  , RegisterHandlerFunction)


const Register = app;

export default Register;
