// require("dotenv").config();
import dotenv from "dotenv";
dotenv.config();
import express, { Router as ExpressRouter } from "express";
var app = express();
import keys from "./config/keys";
import fs from "fs";
import mongoose from "mongoose";
import passport from "./config/Passport";
import session, { Session } from "express-session";
import flash from "express-flash";
import path from "path";
// const MongoStore = require("connect-mongodb-session")(session);
import MongoStore, { MongoDBStore } from "connect-mongodb-session";
import Cors from "cors";

const mongoStore = MongoStore(session);
import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
var publicPath = path.join(__dirname, "public/images/users");
// var imagesPrefix = "/public/images/users";
if (process.env.NODE_ENV === "production") {
  // imagesPrefix = "/build/public/images/users";
  publicPath = path.join(__dirname, "public/images/users");
}
const IMAGE_PREFIX = "/images/users";
app.use(IMAGE_PREFIX, express.static(publicPath));
app.use(express.json());

mongoose.set("strictQuery", true);
mongoose.connect(keys.mongodb.dbURI, (err) => {
  if (err) console.error("mongoose error occured : ", err.message);
  console.log("Connected to mongodb server");
});

//configuring our session to increase the timeout of the connection
const store: any = new mongoStore({
  uri: keys.mongodb.dbURI,
  collection: "sessions",
});
// app.use(
//   session({
//     secret: process.env.SESSION_TOKEN as string,
//     resave: true,
//     saveUninitialized: false,
//     proxy: true, //or use this
//     rolling: true,
//     store: store,
//     cookie: {
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//       // sameSite: true,
//       secure: process.env.NODE_ENV === "production",
//       // secure: false,
//       maxAge: 1000 * 3600 * 24 * +14, // the session will be valid for 14 days
//     },
//   })
// );
// app.use(passport.authenticate("jwt", { session: false }));
app.use(passport.initialize());
// app.use(passport.session());
app.use(flash());

app.use(
  Cors({
    origin: [
      "*",
      "http://localhost:3000",
      "https://dexchat-frontend.onrender.com",
      "https://dexchat-full.onrender.com",
      "https://dexchat.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // enable set cookie
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"], // Specify allowed headers
  })
);

//app.use("/", require("./routes/register"));
fs.readdir("./routes", async (err, files) => {
  files.filter(async (file) => {
    file = file.slice(0, file.length - 3);
    //app.use("/", require("./routes/" + file));
    const route = require("./routes/" + file);
    app.use(route.default, (res, req, next) => {
      next();
    });
    // const route = await import("./routes/" + file);

    // console.log(route)
    // app.use(route.default)
  });
});

const Router = express.Router();

app.use(Router);
//export default  { app, db: mongoose };
export default app;
