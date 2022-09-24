import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Form = (props) => {
	const [sources, setSources] = useState({})
	const [category, setcategory] = useState("")
	const [id, setID] = useState(0)

	let navigate = useNavigate()

	useEffect(() => {
		const getSources = async () => {
			await axios.get(props.api).then((res) => {
				setSources(res.data)
			})
		}

		getSources()
	}, [props.api])

	const handleSubmit = (e) => {
		e.preventDefault()
		navigate(category + "/" + id)
	}

	const handleChange = (e) => {
		const val = e.target.value
		setcategory(e.target.selectedOptions[0].innerText)
	}
	return (
		<form onSubmit={(e) => handleSubmit(e)}>
			<div className="row half">
				<select onChange={(e) => handleChange(e)}>
					<option val="0"></option>
					{sources &&
						Object.entries(sources).map((x, i) => {
							return (
								<option
									key={i}
									value={x[1]}
								>
									{x[0]}
								</option>
							)
						})}
				</select>
				<label>ID: </label>
				<input onChange={(e) => setID(e.target.value)} />
				<button type="submit">Search</button>
			</div>
		</form>
	)
}

export default Form
