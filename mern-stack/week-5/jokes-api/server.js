const express = require("express")
const app = express()
const PORT = 8000
require("./config/mongoose.config")

//middleware
app.use(express.json(), express.urlencoded({ extended: true }))

const AllRoutes = require("./routes/jokes.routes")
AllRoutes(app)

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
