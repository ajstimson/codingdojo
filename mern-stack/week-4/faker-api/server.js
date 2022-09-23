const express = require("express")
const app = express()
const PORT = 9000

app.listen(9000, "0.0.0.0")

const faker = require("faker")

const createRandomUser = () => {
	return {
		userId: faker.datatype.uuid(),
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		email: faker.internet.email(),
		phoneNumber: faker.phone.phoneNumber(),
		password: faker.internet.password(),
	}
}

const createRandomCompany = () => {
	return {
		companyId: faker.datatype.uuid(),
		companyName: faker.company.companyName(),
		street: faker.address.streetAddress(),
		city: faker.address.city(),
		state: faker.address.state(),
		zipCode: faker.address.zipCode(),
		country: faker.address.country(),
	}
}

// Middleware
// app.use(express.json)
// app.use(express.urlencoded({ extended: true }))

app.get("/api/users/new", (req, res) => {
	const newUser = createRandomUser()
	res.json({ User: newUser })
})

app.get("/api/company/new", (req, res) => {
	const newCompany = createRandomCompany()
	res.json({ Company: newCompany })
})

app.get("/api/company", (req, res) => {
	const newUser = createRandomUser()
	const newCompany = createRandomCompany()
	res.json({ User: newUser, Company: newCompany })
})

app.get("/", (req, res) => {
	res.json({ message: "WTF?!" })
})
