const app = require('./register.route');
const router = require('express').Router();
const Contact = require('../model/Contact.model')
const messages = require('../model/Messages.model')
const user = require('../model/User.model');
const mongoose = require('mongoose');

router.get("/:id", async (req, res) => {
    res.json("")

})

router.post("/:id/send", async (req, res) => {
    const senderId = req.params.id
    var Message = new messages({ message: req.body.msg })

})
router.get('/contacts/:id', (req, res) => {
    user.find({}, (err, users) => {
        if (err) console.log(err)
        users.map(value => {
            Contact.findOne({ $or: [{ firstSide: value.id }, { SecondSide: value.id }] }, (err, resu) => {
                if (err) { console.log(err) }
                if (!resu) {
                    var contacts = new Contact({ name: value.name, SecondSide: value.id, firstSide: mongoose.Types.ObjectId(req.params.id) })
                    contacts.save()
                }
            })
        })
    })
    Contact.find({
        $or: [
            { firstSide: req.params.id },
            { SecondSide: req.params.id }
        ]
    },
        (err, resp) => {
            if (err) console.log(err)
            res.json({ Contacts: resp })
        })

})
app.use("/user", (req, res, next) => {

    if (req.isAuthenticated()) {
        next()
    }
    else {
        return res.json("You must Sign in")

    }

})
app.use('/user', router)
module.exports = app