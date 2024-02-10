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
import Cors from "cors"

const mongoStore = MongoStore(session)
import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/images/users', express.static(path.join(__dirname, 'public/images/users')));
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

app.use(
  session({
    secret: process.env.SESSION_TOKEN as string,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: store,
  })
);
app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(
  Cors({
    origin: [
      "*",
      "http://localhost:3000",
      "http://localhost:4173",
      "http://192.168.137.245",
      "http://192.168.1.191:43483",
      "http://localhost:43483",
      "https://dexchat.vercel.app",
    ],
    methods: ["GET", "POST", "DELETE", "UPDATE"],
    credentials: true, // enable set cookie
  })
);
import joinRoomrequest from "./routes/JoinRoom"
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
