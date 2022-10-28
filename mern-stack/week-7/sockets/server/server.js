const express = require("express")
const app = express()
const socket = require("socket.io")
const PORT = 8000
const cors = require("cors")
require("./config/mongoose.config.js")

const server = app.listen(PORT, () => {
	console.log(`Listening on port: ${PORT}`)
})

//middleware
app.use(
	express.json(),
	express.urlencoded({ extended: true }),
	cors({
		origin: "http://localhost:3000",
	})
)

const io = socket(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
		allowedHeaders: ["*"],
		credentials: true,
	},
})

io.on("connection", (socket) => {
	console.log("socket id: " + socket.id)

	socket.on("event_from_client", (data) => {
		// send a message with "data" to ALL clients EXCEPT for the one that emitted the
		//     "event_from_client" event
		socket.broadcast.emit("Welcome", data)
	})
})

// const AllRoutes = require("./routes/socket.routes")
// AllRoutes(app)

// app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
