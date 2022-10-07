import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Form = (props) => {
	const fields = ["title", "price", "description"]
	const [state, setState] = useState({})
	const navigate = useNavigate()

	const handleSubmit = (e) => {
		e.preventDefault()

		fields.forEach((field) => {
			const value = e.target[field].value
			setState((state[field] = value))
		})
		e.target.reset()
		createProduct()
	}

	const createProduct = () => {
		console.log(state)
		axios
			.post("http://localhost:8000/api/products/new", state)
			.then((res) => {
				navigate("/")
			})
			.catch((err) => {
				console.log(err)
			})
	}
	return (
		<form onSubmit={(e) => handleSubmit(e)}>
			{fields.map((field, i) => (
				<div
					className="row"
					key={i}
				>
					<label>{field}</label>
					<input
						type="text"
						name={field}
					></input>
				</div>
			))}
			<button type="submit">Create</button>
		</form>
	)
}

export default Form
