const app = require('./register.route');
const router = require('express').Router();
const Contact = require('../model/Contact.model')
const messages = require('../model/Messages.model')
const user = require('../model/User.model');
const mongoose = require('mongoose');

router.get("/:id", async (req, res) => {
    var User = await user.find({})
    User.map(value => {

        Contact.findOne({ name: value.name }, (err, res) => {
            if (err) { console.log(err) }
            if (!res) {
                var contacts = new Contact({ name: value.name, SecondSide: value.id, firstSide: mongoose.Types.ObjectId(req.params.id) })
                contacts.save()
            }
        })
    })
    var Contacts = await Contact.find({
        $or: [
            { firstSide: req.params.id },
            { secondSide: req.params.id }
        ]
    },
        (err) => {
            if (err) console.log(err)
        })
    res.json({ Contacts: Contacts })

})

router.post("/:id/send", async (req, res) => {
    const senderId = req.params.id
    var Message = new messages({ message: req.body.msg })

})
app.use("/user", (req, res, next) => {

    if (req.isAuthenticated()) {
        next()
    }
    else {
        console.log(req.session)
        return res.json("You must Sign in")

    }

})
app.use('/user', router)
module.exports = app