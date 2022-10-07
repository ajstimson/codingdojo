const ProductsController = require("../controllers/products.controller")

module.exports = (app) => {
	app.post("/api/products/new", ProductsController.createProduct)
	app.get("/api/products/all", ProductsController.getAllProducts)
	app.get("/api/products/:id", ProductsController.getSingleProduct)
}
