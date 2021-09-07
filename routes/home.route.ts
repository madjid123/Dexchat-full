require("dotenv").config();
import { Router } from "express";
//import isAuth from "/middlewares";
const app = Router();
app.get("/", (req, res, next) => {
  res.json("Welcome " + req.user ? "" : `${req.user}`)

});

module.exports = app;
