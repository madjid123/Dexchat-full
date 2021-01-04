const app = require('./register.route');
const router = require('express').Router();
const MessageRoom = require('../model/MessageRoom.model')



router.get("/:id", (req, res) => {
    var Contacts = await MessageRoom.find({})
    res.json(req.params.id)

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