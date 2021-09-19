import dotenv from "dotenv"
dotenv.config();

import app from "./app"
import mongoose from "mongoose";

import keys from "./config/keys";

import https from "https";
import { MessageType } from "./model/Message";
const server = app.listen(process.env.PORT || 5000, () => {
  console.log("app is running on port 5000");
});
const Server = https.createServer(app);
import socketio from "socket.io"

const io = new socketio.Server(Server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
var users = [] as any[];
const addUser = (username: any, socketID: any) => {
  if (!users.some((user) => user[username] === socketID)) {
    users[username] = socketID;
  }
};
io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.on("sendusr", (data) => {
    if (!data.roomId) return;
    const user = data.user;
    addUser(user._id, data.roomId);
  });
  socket.on("sendmsg", (data) => {
    console.log(socket.rooms);
    console.log(users);
    console.log(data);
    const message = data.message as MessageType
    console.log(message.Receiver.id)
    socket.volatile.to(users[message.Receiver.id as any]).emit("getmsg", {
      message: message
    });
  });
  socket.on("disconnect", (reason) => {
    console.log("Disconnected");
    console.log(reason);
  });
});

io.listen(5001);
process.on("SIGINT", () => {
  io.close();
  server.close((err) => {
    if (err) console.log(err.message);
  });
  mongoose.disconnect();
  process.exit(1);
});
