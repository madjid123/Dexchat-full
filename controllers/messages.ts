
import { Request, Response, NextFunction } from "express";
import User from "../model/User"
import Message from "../model/Message";
import mongoose from "mongoose";
import Room from "../model/Room";
const PER_PAGE = 10
export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const room_id = req.params.room_id
		let Querypage = "", page: number;
		console.log("params ", req.query.page)
		if (req.query.page !== undefined)
			Querypage = req.query.page as string

		let Room_id = new mongoose.Types.ObjectId(room_id)

		const _room_id = new String(Room_id.toHexString())
		const messages_count = await Message.find({ Room: { id: Room_id } }).countDocuments()
		page = (Querypage.length !== 0) ? parseInt(Querypage) : 1
		const Pages = Math.ceil(messages_count / PER_PAGE)
		const messages = await Message.find({ Room: { id: Room_id } })
			.skip((messages_count > PER_PAGE && page < Pages) ? (messages_count - PER_PAGE * page) : 0)
			.limit(PER_PAGE)

		res.json({
			messages: messages,
			page: page,
			pages: Math.ceil(messages_count / PER_PAGE),
		})

	} catch (err) {
		const error = err as Error
		console.error(error)
		res.status(400).json({ error: error.message })
	}


}

