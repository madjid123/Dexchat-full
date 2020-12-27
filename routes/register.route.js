const e = require('express');
const { app, db } = require('../index');
const user = require('../model/User.model')
const js = require("js-sha256")
js.sha256()
app.get('/register', (req, res) => {

    const { name, email, password } = req.body
    user.find({ name: name }, (err, user) => {

        if (err) console.log(err)
        if (user === undefined) {
            var data = new user({ name, email, sha256(password) })
            data.save()
        }
    })
})


