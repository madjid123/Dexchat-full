
import { Request, Response, NextFunction } from "express";
import User from "../model/User"
// implements a response to /search "GET" request
export const SearchForUserFunc = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pattern = req.params.pattern
        const similarUsers = await User.find({ username: `/^${pattern}/$` })
        if (similarUsers.length === 0) {
            res.status(404).send('No such user similar to this username')
            return
        }
        res.status(200).send({ users: similarUsers })
    } catch (e: any) {
        const err = e as Error
        console.error(err)
        res.status(500).send(err)
    }

}