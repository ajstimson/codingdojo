import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"

const SingleProduct = (props) => {
	let { id } = useParams()
	const [product, setProduct] = useState({})

	useEffect(() => {
		console.log(id)

		axios
			.get("http://localhost:8000/api/products/" + id)
			.then((res) => {
				setProduct(res.data)
			})
			.catch((err) => console.log("There was a problem", err))
	}, [id])

	console.log(product)

	return (
		<>
			{product &&
				Object.entries(product).map(([key, value], i) => (
					<div
						className="single-product"
						key={i}
					>
						<h1>{key === "title" && value}</h1>
						<p className="price">{key === "price" && value}</p>
						<p className="details">{key === "description" && value}</p>
					</div>
				))}
		</>
	)
}

export default SingleProduct
