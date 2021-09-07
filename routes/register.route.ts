import { Router } from "express";
import user from "../model/User";
import { sha256 } from "js-sha256";
const app = Router()
app.post("/register", async (req, res, next) => {
  if (req.isAuthenticated() === true) return res.json({ err: true, msg: "you must logout" });

  const { name, email, password } = req.body;
  if (!req.body || !name || !email || !password)
    return res.json({ err: "true", msg: "You have to fill the form !" });

  const persons = await user.find({ $or: [{ email: email }, { name: name }] });

  if (persons.length !== 0) {
    return res.json({ err: true, msg: "User already exist" });
  } else {
    var newUser = new user({ name, email, password: sha256(password) });
    newUser.save();
    res.json({ err: false, msg: "User successfully created", name: name });
  }
});

const Register = app;

module.exports = Register;
