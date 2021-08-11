require("dotenv").config();
const app = require("express").Router();
const isAuth = require("./middlewares");

app.get("/", (req, res, next) => {
  res.json("Welcome " + req.user ? "" : `${req.username}`);
});

module.exports = app;
