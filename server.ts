import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import mongoose, { ObjectId, SchemaType } from "mongoose";
import keys from "./config/keys";
import session from "express-session";
import passport from "./config/Passport";
import { MessageType } from "./model/Message";
import MongoStore from "connect-mongodb-session";
import jwt from "jsonwebtoken";
// const MongoStore = require("connect-mongodb-session")(session)
const mongoStore = MongoStore(session);

const server = app.listen(process.env.PORT || 5000, () => {
  console.log("app is running on port 5000");
});
import { Server } from "socket.io";
import User, { UserType } from "./model/User";
import isEqual from "lodash.isequal";
const wrap = (middleware: any) => (socket: any, next: any) =>
  middleware(socket.request, {}, next);
const store: any = new mongoStore({
  uri: process.env.MONGODB_URL!,
  collection: "sessions",
});
const io = new Server(server, {
  cors: {
    origin: ["*", "http://localhost:3000", "https://dexchat.vercel.app"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  },
  transports: ["websocket"],
});

// io.use(
// wrap(
//   session({
//     secret: process.env.SESSION_TOKEN as string,
//     resave: false,
//     saveUninitialized: false,
//     rolling: true,
//     store: store,
//   })
// )
// );
//app.use(passport.use, () => { });
io.use(wrap(passport.initialize()));
// io.use(wrap(passport.authenticate("jwt", { session: false })));
// io.use(wrap(passport.session()));
io.use(async (socket, next) => {
  try {
    const token: string = socket.handshake.query.token as string;
    const user = jwt.verify(
      token,
      process.env.SECRET_KEY as string
    ) as UserType;
    const dbUser = await User.findById(user._id);
    const dbUserCred = {
      _id: dbUser?._id.toHexString(),
      username: dbUser?.username,
      email: dbUser?.email,
      password: dbUser?.password,
    };
    const userCred = {
      _id: user._id,
      username: user.username,
      email: user.email,
      password: user.password,
    };
    if (isEqual(userCred, dbUserCred)) {
      next();
    } else {
      throw new Error("User  not found");
    }
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    socket.send("Unauthorized :" + error.message);
  }
});
var users = [] as any[];
const addUser = (username: any, socketID: any) => {
  if (!users.some((user) => user[username] === socketID)) {
    users[username] = socketID;
  }
};
const removeUser = (socketID: string) => {
  users = users.map((user, idx) => {
    if (idx !== users.indexOf(socketID)) return user;
  });
};
io.on("connection", (socket) => {
  socket.on("sendsocket", (data) => {
    const user = data.user;
    data.rooms.map((room: any) => {
      socket.join(room);
    });
    if (!user) return;
    if (users.indexOf(data.roomID) !== user._id) addUser(user._id, data.roomId);
  });
  socket.on("sendmsg", (data) => {
    const message = data.message as MessageType;
    const room_id = message.Room.id as any as string;
    socket
      .to(room_id)
      .emit(`getmsg:${room_id}`, { message: message, room: room_id });
  });
  socket.on("typing", (data) => {
    socket.to(users[data.Receiver]).emit("typing", data.Sender);
  });
  socket.on("disconnect", (reason) => {
    removeUser(socket.id);
  });
});

// const port = process.env.PORT ? Number.parseInt(process.env.PORT) : 5001;
// io.listen(port)
process.on("SIGINT", () => {
  // io.close();
  server.close((err) => {
    if (err) console.error(err.message);
  });
  mongoose.disconnect();
  process.exit(1);
});
export default server;
