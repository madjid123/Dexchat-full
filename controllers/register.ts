import { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"
import { sha256 } from "js-sha256"
import User from "../model/User"

export const RegisterHandlerFunction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { email, username, password } = req.body

        var newUser = new User({ username: username, email, password: sha256(password) });
        newUser.save();
        return res.json({ response: "User successfully created", name: username });

    } catch (e) {
        const err = e as Error
        console.error(err.message)
        res.status(402).json(err.message)

    }
}