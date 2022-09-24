import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import ListItems from "./ListItems"
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
			resetStates()

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

	const resetStates = () => {
		setError({})
		setState({})
		setHome("")
		setSpecies("")
	}

	const listObj = () => {
		const list = []
		const forbidden = ["created", "edited", "url", "name", "title", "species"]
		Object.entries(state).map(([key, value], i) => {
			if (!forbidden.includes(key) && !Array.isArray(value)) {
				key = key.charAt(0).toUpperCase() + key.slice(1).replaceAll("_", " ")
				if (key === "Homeworld") {
					home ? list.push([key, home]) : list.push([key, "looking..."])
				} else {
					list.push([key, value])
				}
			}
		})
		return list
	}
	return (
		<div className="display column">
			{error > 0 ? (
				<h2 className="error">
					These aren't the droids you're looking for. <br />
					<sup>404</sup>
				</h2>
			) : (
				<>
					<h2>{category === "films" ? state.title : state.name}</h2>

					<ul>
						{category === "people" && (
							<ListItems
								category={"Species"}
								data={species ? species : "looking..."}
							/>
						)}
						{listObj().map((item, i) => (
							<ListItems
								key={i}
								category={item[0]}
								data={item[1]}
							/>
						))}
						{state.people && (
							<BatchData
								lookUp={state.people}
								category={"People"}
							/>
						)}
						{state.films && (
							<BatchData
								lookUp={state.films}
								category={"Films"}
							/>
						)}
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
						{state.residents && (
							<BatchData
								lookUp={state.residents}
								category={"Residents"}
							/>
						)}
						{state.vehicles && (
							<BatchData
								lookUp={state.vehicles}
								category={"Vehicles"}
							/>
						)}
						{category !== "people" && state.species && (
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
						{state.pilots && (
							<BatchData
								lookUp={state.pilots}
								category={"Pilots"}
							/>
						)}
					</ul>
				</>
			)}
		</div>
	)
}

export default Display
