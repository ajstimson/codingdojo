import "./App.css"
import { useState, useEffect } from "react"
import Display from "./components/Display"

const API = "https://pokeapi.co/api/v2/pokemon?limit=220&offset=0"

function App() {
	const [pokemon, setPokemon] = useState({})

	const fetchPokemon = () => {
		setPokemon({})
		//This will get the info using the fetch api
		fetch(API)
			.then((response) => response.json())
			.then((data) => setPokemon({ data: data.results }))
	}

	const asyncPokemon = async () => {
		setPokemon({})
		try {
			let response = await fetch(API)
			let data = await response.json()
			pokemon ? setPokemon({ data: data.results }) : console.log("WTF?!")
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<div className="App">
			<div className="column">
				<button onClick={fetchPokemon}>Fetch</button>
				<button onClick={asyncPokemon}>Async</button>
			</div>
			<Display pokemon={pokemon} />
		</div>
	)
}

export default App
