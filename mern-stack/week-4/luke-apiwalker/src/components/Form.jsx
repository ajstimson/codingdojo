import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

const Form = (props) => {
	const [sources, setSources] = useState({})
	const [selectCat, setSelectCat] = useState("")
	const [formID, setFormID] = useState(0)

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
		navigate(selectCat + "/" + formID)
	}

	const handleChange = (e) => {
		setSelectCat(e.target.selectedOptions[0].innerText)
	}
	console.log(props.parameters.category ? props.parameters.category : 0)
	return (
		<form onSubmit={(e) => handleSubmit(e)}>
			<div className="row half">
				<select
					value={props.parameters.category ? props.parameters.category : 0}
					onChange={(e) => handleChange(e)}
				>
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
				<input onChange={(e) => setFormID(e.target.value)} />
				<button type="submit">Search</button>
			</div>
		</form>
	)
}

export default Form
