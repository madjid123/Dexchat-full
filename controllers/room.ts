import { Response, Request, NextFunction } from "express";
import Message, { MessageType } from "../model/Message";

export const RoomSendMessage = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const room_id = req.params.room_id
		console.log(req.params)
		const message = req.body as MessageType
		console.log("message", req.body)
		const NewMessage = new Message(message)
		await NewMessage.validate()
		await NewMessage.save()
		console.log(NewMessage)
		res.json({ message: "Message was sent successfully ! " })
		next()


	} catch (err) {
		const error = err as Error
		console.error(error)
		res.status(400).json({ error: error.message })

	}

}