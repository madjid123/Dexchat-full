import express, { Router } from "express";
import Room, { RoomType } from "../model/Room";
import Message from "../model/Message";
import User from "../model/User";
import mongoose from "mongoose";
const app = express()
const router = Router()
router.get("/:id", async (req, res, next) => {
  res.json("");
});
router.post("/:id/send", async (req, res) => {
  const senderId = req.params.id;
  var message = new Message({
    message: req.body.msg,
  });
});
router.get("/contacts/:id", async (req, res, next) => {
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
      members: { $in: [mongoose.Types.ObjectId(req.params.id)] },
    }).populate("members", "username _id");
    res.json({
      Rooms: rooms,
    });
  } catch (err: any) {
    console.log(err);
    res.json({
      err: err.message,
    });
  }
});
router.use("/user", (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.json("You must Sign in");
  }
});
app.use("/user", router);
module.exports = app
