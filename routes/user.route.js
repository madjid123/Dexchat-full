const app = require('./register.route');
const router = require('express').Router();
const Contact = require('../model/Contact.model')



router.get("/:id", async (req, res) => {
    var Contacts = await Contact.find({ $or: [{ firstSide: req.params.id }, { secondSide: req.params.id }] }, (err) => console.log(err))
    res.json({ Contacts: Contacts })

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