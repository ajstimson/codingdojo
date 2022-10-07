import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

const Form = () => {
	const fields = ["title", "price", "description"]
	const [productDetails, setProductDetails] = useState({})
	const navigate = useNavigate()
	const { id } = useParams()

	useEffect(() => {
		id &&
			axios
				.get("http://localhost:8000/api/products/" + id)
				.then((res) => {
					setProductDetails({
						title: res.data.title,
						price: res.data.price,
						description: res.data.description,
					})
				})
				.catch((err) => console.log("There was a problem", err))
	}, [id])
	const handleSubmit = (e) => {
		e.preventDefault()

		fields.forEach((field) => {
			const value = e.target[field].value
			setProductDetails((productDetails[field] = value))
		})
		e.target.reset()
		id ? updateProduct() : createProduct()
	}

	const createProduct = () => {
		axios
			.post("http://localhost:8000/api/products/new", productDetails)
			.then((res) => {
				navigate("/products")
			})
			.catch((err) => {
				console.log(err)
			})
	}

	const updateProduct = () => {
		axios
			.put("http://localhost:8000/api/products/update/" + id, productDetails)
			.then((res) => {
				navigate("/product/" + id)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	console.log(productDetails)
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
						defaultValue={productDetails[field] || ""}
					></input>
				</div>
			))}
			<button type="submit">Create</button>
		</form>
	)
}

export default Form
