import dotenv from "dotenv"
dotenv.config();

import app from "./app"
import mongoose from "mongoose";

import keys from "./config/keys";
import session from "express-session"
import passport from "./config/Passport"
import https from "https";
import { MessageType } from "./model/Message";
const MongoStore = require("connect-mongodb-session")(session)
const server = app.listen(process.env.PORT || 5000, () => {
  console.log("app is running on port 5000");
});
const Server = https.createServer(app);
import socketio from "socket.io"
const wrap = (middleware: any) => (socket: any, next: any) => middleware(socket.request, {}, next);
const store: any = new MongoStore({
  uri: keys.mongodb.dbURI,
  collection: "sessions",
})
const io = new socketio.Server(Server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
io.use(
  wrap(
    session({
      secret: process.env.SESSION_TOKEN as string,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      store: store

    }))
);
//app.use(passport.use, () => { });
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));
io.use((socket: any, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error("unauthorized"))
  }
});
var users = [] as any[];
const addUser = (username: any, socketID: any) => {
  if (!users.some((user) => user[username] === socketID)) {
    users[username] = socketID;
  }
};
const removeUser = (socketID: string) => {
  console.log(socketID)
  users = users.map((user, idx) => { if (idx !== users.indexOf(socketID)) return user })
}
io.on("connection", (socket) => {
  console.log("connection", socket.id)
  socket.on("sendsocket", (data) => {
    if (!data.user) return;
    console.log("sendusr")
    const user = data.user;
    data.rooms.map((room: any) => { socket.join(room) })
    console.log(socket.rooms)
    if (users.indexOf(data.roomID) !== user._id)
      addUser(user._id, data.roomId);
  });
  socket.on("sendmsg", (data) => {
    const message = data.message as MessageType
    // socket.volatile.to(users[message.Receiver.id as any]).emit("getmsg", {
    //   message: message
    // });
    console.log(message)
    socket.to(message.Room.id as any).emit(`getmsg:${message.Room.id}`, { message: message, room: message.Room.id })
  });
  socket.on("typing", (data) => {
    socket.to(users[data.Receiver]).emit("typing", data.Sender)
  })
  socket.on("disconnect", (reason) => {

    console.log("Disconnected");
    console.log(reason);
    removeUser(socket.id)
    console.log(users)
  });
});

io.listen(5001);
process.on("SIGINT", () => {
  // io.close();
  console.log("io is diconnecting")
  server.close((err) => {
    if (err) console.log(err.message);
  });
  mongoose.disconnect();
  process.exit(1);
});
