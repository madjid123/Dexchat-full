import dotenv from "dotenv"
dotenv.config();

import app from "./app"
import mongoose from "mongoose";

import keys from "./config/keys";
import session from "express-session"
import passport from "./config/Passport"
import https from "https";
import { MessageType } from "./model/Message";
import MongoStore from "connect-mongodb-session";
// const MongoStore = require("connect-mongodb-session")(session)
const mongoStore = MongoStore(session);
const server = app.listen(process.env.PORT || 5000, () => {
  console.log("app is running on port 5000");
});
const HttpServer = https.createServer(app);
import { Server } from "socket.io"
const wrap = (middleware: any) => (socket: any, next: any) => middleware(socket.request, {}, next);
const store: any = new mongoStore({
  uri: keys.mongodb.dbURI,
  collection: "sessions",
})
const io = new Server(HttpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://dexchat.vercel.app"]
  },
  transports: ["websocket"],
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
  users = users.map((user, idx) => { if (idx !== users.indexOf(socketID)) return user })
}
io.on("connection", (socket) => {
  socket.on("sendsocket", (data) => {
    const user = data.user;
    data.rooms.map((room: any) => { socket.join(room) })
    if (!user) return;
    if (users.indexOf(data.roomID) !== user._id)
      addUser(user._id, data.roomId);
  });
  socket.on("sendmsg", (data) => {
    const message = data.message as MessageType
    const room_id = (message.Room.id as any) as string
    socket.to(room_id).emit(`getmsg:${room_id}`, { message: message, room: room_id })
  });
  socket.on("typing", (data) => {
    socket.to(users[data.Receiver]).emit("typing", data.Sender)
  })
  socket.on("disconnect", (reason) => {

    removeUser(socket.id)
  });
});

io.listen(5001);
process.on("SIGINT", () => {
  // io.close();
  server.close((err) => {
    if (err) console.error(err.message);
  });
  mongoose.disconnect();
  process.exit(1);
});
export default server
