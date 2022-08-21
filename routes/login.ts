import express, { Router } from "express";
import passport from "passport";
import { body, validationResult } from "express-validator"

const router = Router()
const app = express()

router.post("/login",
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
        successRedirect: "/auth/login",
        failureRedirect: "/auth/login",
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

router.get("/logout", async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.log(err.message)
  });
  console.log("logged out");
  req.logout();
  res.json("logged out successfully");
});

router.get("/login", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json("Not logged in");
  }
});
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  (req, res) => { }
);

router.get("/google/redirect", (req, res) => {
  res.redirect("/auth/login");
});
router.get("/failedGoogleLogin", (req, res) => {
  res.status(401).json({ error: "Failed to login using google" });
});
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failedGoogleLogin" }),
  function (req, res) {
    res.redirect("/");
  }
);
app.use("/auth", router)
module.exports = app;
