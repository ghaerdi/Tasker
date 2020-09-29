const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI || "mongodb://localhost/tasker"

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true, useCreateIndex: true})
    .then(_ => console.log("database connected"))
    .catch(err => console.log(err))
