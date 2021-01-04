const app = require('./register.route');
const router = require('express').Router();
const mongoose = require('mongoose');
const passport = require('passport');



router.get("/:id", (req, res) => {
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