import { Router } from "express";
import User from "../model/User";
import { sha256 } from "js-sha256";
import { body, validationResult } from "express-validator"
const app = Router()
app.post("/register",
  body("email").isEmail().normalizeEmail().custom(async value => {
    const exists = await User.exists({ email: value })
    if (exists) {
      return Promise.reject("Email already in use !")
    }

  }),
  body("username").isAlphanumeric().trim().custom(async value => {
    const exists = await User.exists({ name: value })
    if (exists) {
      return Promise.reject("Username already in use !")
    }

  }),
  body("password").isLength({ min: 6 })
  , async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      const { email, username, password } = req.body

      var newUser = new User({ name: username, email, password: sha256(password) });
      newUser.save();
      return res.json({ response: "User successfully created", name: username });

    } catch (err: any) {

      console.error(err.message)
      res.status(402).json(err.message)

    }
  });

const Register = app;

module.exports = Register;
