require("dotenv").config();

const { app } = require("./app");
const mongoose = require("mongoose");

var keys = require("./config/keys");

require("./model/User");
require("./model/Message");
require("./model/Room");
const https = require("https");

const server = app.listen(5000, () => {
  console.log("app is running on port 5000");
});
const Server = https.createServer(app);

const io = require("socket.io")(Server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

var users = [];
io.on("connection", (socket) => {
  socket.on("sendusr", (user) => {
    console.log(user);
    if (user.me && user.me.username != "" && user.me.id !== "") {
      socket.join(user.me.id);
      users[user.me.username] = user.me.id;
    }
  });
  console.log(users);
  socket.on("sendmsg", (data) => {
    console.log("to id ", data);
    socket.to(data.toid).emit("getmsg", {
      message: data.msg,
      username: data.name,
      toid: data.toid,
    });
  });
});

io.listen(5001);
process.on("SIGINT", () => {
  server.close((err) => {
    if (err) console.log(err.message);
  });
  mongoose.disconnect();
  process.exit(1)
});
