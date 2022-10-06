const mongoose = require("mongoose")

mongoose
	.connect("mongodb://localhost/products_db", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("connected to the products_db")
	})
	.catch((err) =>
		console.log("Something went wrong when connecting to the database", err)
	)
