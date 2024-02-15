import express, { Router } from "express";
import passport from "passport";
import { body, validationResult } from "express-validator";
import User, { UserType } from "../model/User";
import { sha256 } from "js-sha256";
import jwt from "jsonwebtoken";
import { PassportUserType } from "../config/Passport";
import { isAuth } from "../utils/middlewares/middlewares";
import dotenv from "dotenv";
dotenv.config();
const router = Router();
const app = express();

router.post(
  "/login",
  body("password").isString().exists(),
  body("username").isString().exists(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((error) => {
          return error.msg;
        }),
      });
    }
    try {
      passport.authenticate(
        "local",
        {
          session: false,
          // // successRedirect: "/auth/",
          // // failureRedirect: "/auth/login",
          // failureFlash: true,
        },
        async (
          err: Error,
          user: PassportUserType | undefined,
          info: { message: string } | undefined
        ) => {
          if (err) return res.status(400).json({ errors: [err.message] });
          if (!user) {
            const errors = [info?.message] as string[];
            return res.status(401).json(errors);
          }
          const SECRET_KEY = process.env.SECRET_KEY || "you-got-that-right!";
          let userInfo = await User.findById(user._id);
          if (userInfo === null) {
            return res.status(401).json("No such user with this id ");
          }
          const newToken = jwt.sign(userInfo.toJSON(), SECRET_KEY, {
            expiresIn: "14d",
          });
          // passport.authenticate("jwt" ,{session : false},)
          return res.json({ token: newToken });
        }
      )(req, res, next);
    } catch (e) {
      let err = e as Error;
      console.error(err.message);
      return res.status(500).json({ errors: [err.message] });
    }
  }
);
router.get("/logout", async (req, res, next) => {
  try {
    req.logout((err) => {
      if (err !== undefined) {
        console.error(err.message);
        if (!req.isAuthenticated()) res.json("logged out successfully");
        else throw err;
      } else {
        throw new Error(err);
      }
    });
  } catch (e) {
    const err = e as Error;
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

router.get("/", isAuth, async (req, res, next) => {
  const user = await User.findById((req.user as UserType)._id);
  if (user === null) {
    res.status(401).json("No such user with this id ");
    return;
  }
  res.json({
    username: user.username,
    email: user.email,
    image: user.image,
    _id: user._id,
  });
});
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  (req, res) => {}
);

router.get("/google/redirect", (req, res) => {
  res.redirect("/auth/login");
});
router.get("/failedGoogleLogin", (req, res) => {
  res.status(401).json({ error: "Failed to login using google" });
});
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failedGoogleLogin",
  }),
  function (req, res) {
    res.redirect("/");
  }
);
app.use("/auth", router);
export default app;
