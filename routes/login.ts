import { Router } from "express";
import passport from "passport";
import sha256 from "sha256";
import User from "../model/User";
import { body, validationResult } from "express-validator"
const app = Router()
app.post("/login",
  body("email").isEmail().normalizeEmail(),
  body("password").isAlphanumeric(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((error) => {
          return error.msg
        })
      })
    }
    passport.authenticate(
      "local",
      {
        successRedirect: "/login",
        failureRedirect: "/login",
        failureFlash: true,
      },
      (err, user, info) => {
        if (err) console.log(err);
        if (!user) {
          const errors = [info?.message] as string[];
          return res.status(401).json(errors);
        }
        req.logIn(user, (err) => {
          if (err) console.log(err);
          res.json(user);
        });
      }
    )(req, res, next);
  });

app.get("/logout", async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.log(err.message)
  });
  console.log("logged out");
  req.logout();
  res.json("logged out successfully");
});

app.get("/login", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json("Not logged in");
  }
});
module.exports = app;
