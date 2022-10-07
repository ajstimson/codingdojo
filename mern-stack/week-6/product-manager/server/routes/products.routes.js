const ProductsController = require("../controllers/products.controller")

module.exports = (app) => {
	app.post("/api/products/new", ProductsController.createProduct)
	app.get("/api/products/all", ProductsController.getAllProducts)
	app.get("/api/products/:id", ProductsController.getSingleProduct)
	app.put("/api/products/update/:id", ProductsController.updateProduct)
	app.delete("/api/products/delete/:_id", ProductsController.deleteProduct)
}
