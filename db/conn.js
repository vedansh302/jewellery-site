const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/Rbsons")
    .then(() => console.log("Connected with mongoDB"))
    .catch(err => console.log("could not connected with database ", err))
