const app = require("./register.route");
const router = require("express").Router();
const Room = require("../model/Room");
const Message = require("../model/Message");
const user = require("../model/User");
const mongoose = require("mongoose");

router.get("/:id", async (req, res) => {
  res.json("");
});

router.post("/:id/send", async (req, res) => {
  const senderId = req.params.id;
  var message = new Message({
    message: req.body.msg,
  });
});
router.get("/contacts/:id", async (req, res) => {
  try {
    const users = await user.find({});
    var username;
    users.map(async (value) => {
      if (value._id === req.params.id) username = value.name;
      const room = await Room.find({
        members: { $in: { _id: [req.params.id] } },
      });
      console.log("room", room);
      if (room.length === 0) {
        var newRoom = new Room({ members: [] });
        newRoom.members.push(req.params.id);
        newRoom.members.push(value._id);
        await newRoom.save();
        return;
      }
    });

    const rooms = await Room.find({}).populate("members");

    res.json({
      Rooms: rooms,
    });
  } catch (err) {
    console.log(err);
    res.json({
      err: err.message,
    });
  }
});
app.use("/user", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.json("You must Sign in");
  }
});
app.use("/user", router);
module.exports = app;
