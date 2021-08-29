const app = require("./register.route");
const router = require("express").Router();
const Room = require("../model/Room");
const Message = require("../model/Message");
const User = require("../model/User");
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
    const Users = await User.find({});
    if (req.params.id === undefined) {
      return res.status(401).json("Must provide an id for this route");
    }
    const User_id = mongoose.Types.ObjectId(req.params.id);
    Users.filter(async (value) => {
      if (
        mongoose.Types.ObjectId(value._id).toHexString() ===
        User_id.toHexString()
      ) {
        return false;
      }
      const rooms = await Room.find({
        members: { $in: [value._id, req.params.id] },
      });
      if (rooms.length === 0) {
        var newRoom = new Room({ members: [] });
        newRoom.members.push(mongoose.Types.ObjectId(req.params.id));
        newRoom.members.push(value._id);
        await newRoom.save();
        return;
      }
    });

    const rooms = await Room.find({
      members: { $in: [req.params.id] },
    }).populate("members", "name _id");

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
app.use("/User", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.json("You must Sign in");
  }
});
app.use("/User", router);
module.exports = app;
