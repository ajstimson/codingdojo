import { useState, useEffect } from "react"
import axios from "axios"

const API = "https://pokeapi.co/api/v2/pokemon?limit=400&offset=0"

const Display = (props) => {
	const [pokemon, setPokemon] = useState([])

	useEffect(() => {
		axios.get(API).then((response) => {
			setPokemon(response.data.results)
		})
	}, [])

	// const { pokemon } = props
	console.log(pokemon)

	return (
		<ul>
			{pokemon ? (
				pokemon.map((pokemon, i) => {
					return (
						<li key={i}>
							<p>{pokemon.name}</p>
						</li>
					)
				})
			) : (
				<h1>Loading...</h1>
			)}
		</ul>
	)
}

export default Display
