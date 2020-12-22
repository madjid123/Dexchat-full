var app = require('express')()
var bodyParser = require('body-parser')


app.get('/', (req, res) => { res.send("<h1> hello </h1>") })







app.listen(3000, () => { console.log("app is running on port 3000") })