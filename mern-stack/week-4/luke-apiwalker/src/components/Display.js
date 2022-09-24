import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import BatchData from "./BatchData"

const Display = (props) => {
	const [error, setError] = useState({})
	const [state, setState] = useState({})
	const [home, setHome] = useState("")
	const [species, setSpecies] = useState("")
	const { category, id } = useParams()
	const url = props.api + category + "/" + id

	useEffect(() => {
		const getInfo = async () => {
			setError("")
			await axios
				.get(url)
				.then((res) => {
					setState(res.data)
					if (category === "species" || category === "people") {
						const getInfo = async () => {
							await axios.get(res.data.homeworld).then((response) => {
								setHome(response.data.name)
							})
						}
						getInfo()
					}
					if (category === "people") {
						const getInfo = async () => {
							await axios.get(res.data.species).then((response) => {
								setSpecies(response.data.name)
							})
						}
						res.data.species.length > 0 ? getInfo() : setSpecies("Human")
					}
				})
				.catch((error) => {
					setError(error.toJSON().status)
					setState({})
				})
		}
		getInfo()
	}, [url, category])

	console.log(state)
	return (
		<div className="display column">
			{error === 404 ? (
				<h2 className="error">
					These aren't the droids you're looking for. <br />
					<sup>404</sup>
				</h2>
			) : (
				<h2>{category === "films" ? state.title : state.name}</h2>
			)}
			{category === "people" && (
				<div className="person">
					<ul>
						<li>
							<span>Species: </span>
							<span>{species ? species : "looking..."}</span>
						</li>
						<li>
							<span>Born: </span>
							<span>{state.birth_year}</span>
						</li>
						<li>
							<span>Height:</span>
							<span>{state.height}</span>
						</li>
						<li>
							<span>Mass: </span>
							<span>{state.mass}</span>
						</li>
						<li>
							<span>Hair Color: </span>
							<span>{state.hair_color}</span>
						</li>
						<li>
							<span>Eye Color: </span>
							<span>{state.eye_color}</span>
						</li>
						<li>
							<span>Skin: </span>
							<span>{state.skin_color}</span>
						</li>
						<li>
							<span>Gender: </span>
							<span>{state.gender}</span>
						</li>

						<li>
							<span>Homeworld: </span>
							<span>{home ? home : "looking..."}</span>
						</li>
						{state.films && (
							<BatchData
								lookUp={state.films}
								category={"Films"}
							/>
						)}
					</ul>
				</div>
			)}
			{category === "species" && (
				<div className="species">
					<sup>({state.designation})</sup>
					<ul>
						<li>
							<span>Class: </span>
							<span>{state.classification}</span>
						</li>
						<li>
							<span>Homeworld: </span> <span>{home ? home : "looking..."}</span>
						</li>
						<li>
							<span>Language: </span>
							<span>{state.language}</span>
						</li>
						<li>
							<span>Height: </span>
							<span>{state.average_height}</span>
						</li>
						<li>
							<span>Lifespan: </span>
							<span>{state.average_lifespan}</span>
						</li>
						<li>
							<span>Eye Colors: </span>
							<span>{state.eye_colors}</span>
						</li>
						<li>
							<span>Skin: </span>
							<span>{state.skin_colors}</span>
						</li>
						<li>
							<span>Hair: </span>
							<span>{state.hair_colors}</span>
						</li>
						{state.films && (
							<BatchData
								lookUp={state.films}
								category={"Films"}
							/>
						)}
						{state.people && (
							<BatchData
								lookUp={state.people}
								category={"People"}
							/>
						)}
					</ul>
				</div>
			)}
			{category === "planets" && (
				<div className="planet">
					<ul>
						<li>
							<span>Climate: </span>
							<span>{state.climate}</span>
						</li>
						<li>
							<span>Population: </span>
							<span>{state.population}</span>
						</li>
						<li>
							<span>Gravity: </span>
							<span>{state.gravity}</span>
						</li>
						<li>
							<span>Terrain: </span>
							<span>{state.terrain}</span>
						</li>
						<li>
							<span>Surface Water: </span>
							<span>{state.surface_water}</span>
						</li>
						<li>
							<span>Orbital Period: </span>
							<span>{state.orbital_period}</span>
						</li>
						{state.films && (
							<BatchData
								lookUp={state.films}
								category={"Films"}
							/>
						)}
					</ul>
				</div>
			)}
			{category === "films" && (
				<div className="film">
					<ul>
						<li>
							<span>Episode: </span>
							<span>{state.episode_id}</span>
						</li>
						<li>
							<span>Director: </span>
							<span>{state.director}</span>
						</li>
						<li>
							<span>Producer: </span>
							<span>{state.producer}</span>
						</li>
						<li>
							<span>Release Date: </span>
							<span>{state.release_date}</span>
						</li>
						{state.characters && (
							<BatchData
								lookUp={state.characters}
								category={"Characters"}
							/>
						)}
						{state.planets && (
							<BatchData
								lookUp={state.planets}
								category={"Planets"}
							/>
						)}
						{state.vehicles && (
							<BatchData
								lookUp={state.vehicles}
								category={"Vehicles"}
							/>
						)}
						{state.species && (
							<BatchData
								lookUp={state.species}
								category={"Species"}
							/>
						)}
						{state.starships && (
							<BatchData
								lookUp={state.starships}
								category={"Starships"}
							/>
						)}
					</ul>
				</div>
			)}
			{category === "vehicles" && (
				<div className="vehicle">
					<ul>
						<li>
							<span>Model: </span>
							<span>{state.model}</span>
						</li>
						<li>
							<span>Manufacturer: </span>
							<span>{state.manufacturer}</span>
						</li>
						<li>
							<span>Cost: </span>
							<span>{state.cost_in_credits}</span>
						</li>
						<li>
							<span>Length: </span>
							<span>{state.length}</span>
						</li>
						<li>
							<span>Max Speed: </span>
							<span>{state.max_atmosphering_speed}</span>
						</li>
						<li>
							<span>Crew: </span>
							<span>{state.crew}</span>
						</li>
						<li>
							<span>Passengers: </span>
							<span>{state.passengers}</span>
						</li>
						<li>
							<span>Cargo Capacity: </span>
							<span>{state.cargo_capacity}</span>
						</li>
						<li>
							<span>Consumables: </span>
							<span>{state.consumables}</span>
						</li>
						<li>
							<span>Vehicle Class: </span>
							<span>{state.vehicle_class}</span>
						</li>
						{state.films && (
							<BatchData
								lookUp={state.films}
								category={"Films"}
							/>
						)}
						{state.pilots && (
							<BatchData
								lookUp={state.pilots}
								category={"Pilots"}
							/>
						)}
					</ul>
				</div>
			)}
			{category === "starships" && (
				<div className="starship">
					<ul>
						<li>
							<span>Model: </span>
							<span>{state.model}</span>
						</li>
						<li>
							<span>Manufacturer: </span>
							<span>{state.manufacturer}</span>
						</li>
						<li>
							<span>Cost: </span>
							<span>{state.cost_in_credits}</span>
						</li>
						<li>
							<span>Length: </span>
							<span>{state.length}</span>
						</li>
						<li>
							<span>Max Speed: </span>
							<span>{state.max_atmosphering_speed}</span>
						</li>
						<li>
							<span>Crew: </span>
							<span>{state.crew}</span>
						</li>
						<li>
							<span>Passengers: </span>
							<span>{state.passengers}</span>
						</li>
						<li>
							<span>Cargo Capacity: </span>
							<span>{state.cargo_capacity}</span>
						</li>
						<li>
							<span>Consumables: </span>
							<span>{state.consumables}</span>
						</li>
						<li>
							<span>Hyperdrive Rating: </span>
							<span>{state.hyperdrive_rating}</span>
						</li>
						<li>
							<span>MGLT: </span>
							<span>{state.MGLT}</span>
						</li>
						<li>
							<span>Starship Class: </span>
							<span>{state.starship_class}</span>
						</li>
						{state.films && (
							<BatchData
								lookUp={state.films}
								category={"Films"}
							/>
						)}
						{state.pilots.length > 0 && (
							<BatchData
								lookUp={state.pilots}
								category={"Pilots"}
							/>
						)}
					</ul>
				</div>
			)}
		</div>
	)
}

export default Display
