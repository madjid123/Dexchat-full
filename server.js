const dotenv = require("dotenv");
dotenv.config();

const { app } = require("./app");
const mongoose = require("mongoose");

var keys = require("./config/keys");

const https = require("https");

const server = app.listen(process.env.PORT || 5000, () => {
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
const addUser = (username, socketID) => {
  if (!users.some((user) => user[username] === socketID)) {
    users[username] = socketID;
  }
};
io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.on("sendusr", (data) => {
    if (!data.roomId) return;
    const user = data.user;
    socket.auth = user;
    addUser(user._id, data.roomId);
  });
  socket.on("sendmsg", (data) => {
    console.log(socket.rooms);
    console.log(users);
    console.log(data);
    socket.volatile.to(users[data.toid]).emit("getmsg", {
      message: data.msg,
      username: data.name,
      toid: data.toid,
      from: data.from,
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
