const express = require("express")
const app = express()
const PORT = 8000
const cors = require("cors")
require("./config/mongoose.config")

//middleware
app.use(express.json(), express.urlencoded({ extended: true }))

app.use(
	cors({
		origin: "http://localhost:3000",
	})
)

const AllRoutes = require("./routes/products.routes")
AllRoutes(app)

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
