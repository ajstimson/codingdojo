const Joke = require("../models/jokes.model")

module.exports = {
	findAllJokes: (req, res) => {
		Joke.find()
			.then((allJokes) => res.json({ jokes: allJokes }))
			.catch((err) => {
				console.log(err)
			})
	},
	createNewJoke: (req, res) => {
		console.log(req)
		Joke.create(req.body)
			.then((result) => {
				res.json(result)
			})
			.catch((err) => {
				console.log(err)
			})
	},
	findOneSingleJoke: (req, res) => {
		Joke.findById(req.params.id)
			.then((result) => {
				res.json(result)
			})
			.catch((err) => {
				console.log(err)
			})
	},
	updateExistingJoke: (req, res) => {
		Joke.updateOne({ _id: req.params.id }, req.body)
			.then((result) => {
				res.json(result)
			})
			.catch((err) => {
				console.log(err)
			})
	},
	deleteAnExistingJoke: (req, res) => {
		Joke.deleteOne({ _id: req.params.id })
			.then((result) => {
				res.json(result)
			})
			.catch((err) => {
				console.log(err)
			})
	},
}
