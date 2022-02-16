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
import Room from "./model/Room";

const io = new socketio.Server(Server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
var users = [] as any[];
const addUser = (username: any, socketID: any) => {
  if (!users.some((user) => user[username] === socketID)) {
    users[username] = socketID;
    console.log("connceted users" , users)
  }
};
const removeUser = (socketID: string) => {
  console.log(socketID)
  users = users.map((user, idx) => { if (idx !== users.indexOf(socketID)) return user })
}
io.on("connection", (socket) => {
  console.log("connection", socket.id) 
  socket.on("sendsocket", (data) => {
    console.log(data)
    if (!data.roomId) return;
    console.log("sendusr")
    const user = data.user;
    console.log(users.indexOf(data.roomID))
    data.rooms.map((room:any)=>{socket.join(room)})
    if (users.indexOf(data.roomID) !== user._id)
      addUser(user._id, data.roomId);
  });
  socket.on("sendmsg", (data) => {
    const message = data.message as MessageType
    // socket.volatile.to(users[message.Receiver.id as any]).emit("getmsg", {
    //   message: message
    // });
    socket.to(message.Room.id as any).emit(`getmsg`, {message:message, room: message.Room.id})
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
