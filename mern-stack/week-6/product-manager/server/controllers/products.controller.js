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
	getAllProducts: (req, res) => {
		Product.find()
			.then((allProducts) => res.json({ products: allProducts }))
			.catch((err) => {
				console.log(err)
			})
	},
	getSingleProduct: (req, res) => {
		Product.findById(req.params.id)
			.then((result) => {
				res.json(result)
			})
			.catch((err) => {
				console.log(err)
			})
	},
	updateProduct: (req, res) => {
		Product.updateOne({ _id: req.params.id }, req.body)
			.then((result) => {
				res.json(result)
			})
			.catch((err) => {
				console.log(err)
			})
	},
	deleteProduct: (req, res) => {
		Product.deleteOne({ _id: req.params._id })
			.then((result) => {
				res.json(result)
			})
			.catch((err) => {
				console.log(err)
			})
	},
}
