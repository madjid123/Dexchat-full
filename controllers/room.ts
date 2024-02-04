import { Response, Request, NextFunction } from "express";
import Message, { MessageType } from "../model/Message";

export const RoomSendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const room_id = req.params.room_id;
    var message = req.body as MessageType;
    // message.SentAt = new Date(0);

    const NewMessage = new Message({
      ...message,
      SentAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await NewMessage.validate();
    await NewMessage.save();
    res.json({ message: "Message was sent successfully ! " });
  } catch (err) {
    const error = err as Error;
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
