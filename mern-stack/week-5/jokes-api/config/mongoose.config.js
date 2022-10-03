const mongoose = require("mongoose")

mongoose
	.connect("mongodb://localhost/jokes_db", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("connected to the jokes_db")
	})
	.catch((err) =>
		console.log("Something went wrong when connecting to the database", err)
	)
