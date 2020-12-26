const e = require('express');
const { app, db } = require('../index');
const user = require('../model/User.model')

app.get('/register', (req, res) => {

    const { name, email, password } = req.body
    user.find({ name: name }, (err, user) => {

        if (err) console.log(err)
        if (user === undefined) {
            var data = new user({ name: name, email: email, password: password })
            user.save(data)
        }
    })
})


