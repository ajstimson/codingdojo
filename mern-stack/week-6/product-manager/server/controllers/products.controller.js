const Product = require("../models/products.model")

module.exports = {
	createProduct: (req, res) => {
		console.log(req.body)
		Product.create(req.body)
			.then((result) => {
				res.json(result)
			})
			.catch((err) => {
				console.log(err)
			})
	},
}
