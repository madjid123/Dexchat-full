import { Router } from "express";
import passport from "passport";
import sha256 from "sha256";
import User from "../model/User";
const app = Router()
app.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    {
      successRedirect: "/login",
      failureRedirect: "/login",
      failureFlash: true,
    },
    (err, user, info) => {
      if (err) console.log(err);
      if (!user) return res.status(401).json(info.message);
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
