const express = require("express")
const app = express()
const cors = require("cors")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

// Settings
app.set("port", process.env.PORT || 3001)

// Middlewares
app.use(morgan("dev"))
app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Routes
app.use("/", require("./routes/index"))

module.exports = app
