

const app = require('express').Router();

app.get('/login', (req, res, next) => {
    const { name, email, password } = req.body
    res.json("dklfj")
})
module.exports = app

