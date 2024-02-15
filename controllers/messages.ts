import { Request, Response, NextFunction } from "express";
import User from "../model/User";
import Message from "../model/Message";
import mongoose from "mongoose";
import Room from "../model/Room";
const PER_PAGE = 20;
export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const room_id = req.params.room_id;
    let Querypage = "",
      page: number;
    let Limit = PER_PAGE;
    if (req.query.page !== undefined) Querypage = req.query.page as string;
    if (req.query.limits !== undefined)
      Limit = parseInt(req.query.limits as string);
    let Room_id = new mongoose.Types.ObjectId(room_id);
    const messages_count = await Message.find({
      Room: { id: Room_id },
    }).countDocuments();
    page = Querypage.length !== 0 ? parseInt(Querypage) : 1;
    const Pages = Math.ceil(messages_count / PER_PAGE);
    let offset = messages_count - PER_PAGE * page;
    if (offset < 0) {
      Limit = messages_count % PER_PAGE;
      offset = 0;
    }
    const messages = await Message.find({ Room: { id: Room_id } })
      .skip(offset)
      .limit(Limit);
    const room = await Room.findOne({ _id: Room_id }).populate(
      "members",
      "username email"
    );
    let pages = Math.ceil(messages_count / PER_PAGE);
    pages = pages === 0 ? 1 : pages;
    res.json({
      messagesResponse: {
        messages: messages,
        page: page,
        pages: pages,
      },
      room: room,
    });
  } catch (err) {
    const error = err as Error;
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
