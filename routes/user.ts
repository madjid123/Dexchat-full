import express, { Router } from "express";
import Room, { RoomType } from "../model/Room";
import Message from "../model/Message";
import User from "../model/User";
import mongoose from "mongoose";
import { isAuth } from "./middlewares"
import { PassportUserType } from "../config/Passport";
const app = express()
const router = Router()


router.get("/rooms", async (req, res, next) => {
  try {
    const id = (req.user as PassportUserType)._id.toHexString()
    const { pattern } = req.query
    let p = ""
    if (pattern === undefined) {
      p = ".*"
    } else {
      p = pattern as string
    }
    const Pattern = new RegExp(`.*${p}.*`, "i")

    var rooms = await Room.find({
      members: { $in: [new mongoose.Types.ObjectId(id)] },
    }).populate("members", "username email ");
    rooms = rooms.filter(room => {
      let Member: any = room.members.find(member => {
        if (member._id.toHexString() !== id) {
          return member
        }
      })
      Member = Member as { username: string, _id: string }
      return Pattern.test(Member.username)
    })
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
app.use("/user/:user_id", isAuth, async (req, res, next) => {
  try {
    if (req.params.user_id !== (req.user as PassportUserType)._id.toHexString()) {
      res.status(500).send("Operation not allowed for this user")
      return;
    }
    next()
  } catch (e) {
    const err = e as Error
    console.error(err)
  }
})
app.use("/user/:user_id", isAuth, router);
module.exports = app
