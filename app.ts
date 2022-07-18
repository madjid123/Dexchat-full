require("dotenv").config();
import express from "express";
var app = express();
import keys from "./config/keys"
import fs from "fs"
import mongoose from "mongoose";
import passport from "./config/Passport";
import session, { Session } from "express-session";
const MongoStore = require("connect-mongodb-session")(session)

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
mongoose.connect(
  keys.mongodb.dbURI,
  (err) => {
    if (err) console.log("mongoose ERR : ", err.message);
    console.log("Connected to mongodb server");
  }
);

//configuring our session to increase the timeout of the connection
const store: any = new MongoStore({
  uri: keys.mongodb.dbURI,
  collection: "sessions",
})

app.use(
  session({
    secret: process.env.SESSION_TOKEN as string,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: store
    //   store: MongoStore.create(
    //     {
    //       mongoUrl: keys.mongodb.dbURI,
    //       autoRemove: "native"
    //     })
  })
);
//app.use(passport.use, () => { });
app.use(passport.initialize());
app.use(passport.session());

app.use(
  require("cors")({
    origin: ["*", "http://localhost:3000", "http://192.168.137.245"],
    methods: ["GET", "POST"],
    credentials: true, // enable set cookie
  })
);

//app.use("/", require("./routes/register"));
fs.readdir("./routes", (err, files) => {
  files.filter((file) => {
    file = file.slice(0, file.length - 3);
    //app.use("/", require("./routes/" + file));
    app.use(require("./routes/" + file), (res, req, next) => { next() });
  });
});

const Router = express.Router();

app.use(Router);
//module.exports = { app, db: mongoose };
export default app