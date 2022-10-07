import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { confirmAlert } from "react-confirm-alert"
import "react-confirm-alert/src/react-confirm-alert.css"
import axios from "axios"

const SingleProduct = (props) => {
	let { id } = useParams()
	const [product, setProduct] = useState({})
	const navigate = useNavigate()

	useEffect(() => {
		console.log(id)

		axios
			.get("http://localhost:8000/api/products/" + id)
			.then((res) => {
				setProduct(res.data)
			})
			.catch((err) => console.log("There was a problem", err))
	}, [id])

	const deleteHandler = (e) => {
		e.preventDefault()
		// const isConfirmed = confirm("Are you sure you want to remove this product?")
		confirmAlert({
			title: "Confirm to Delete",
			message: "Are you sure you want to do this?",
			buttons: [
				{
					label: "Yes",
					onClick: () => deleteItem(),
				},
				{
					label: "No",
				},
			],
		})
	}

	const deleteItem = () => {
		axios
			.delete("http://localhost:8000/api/products/delete/" + id)
			.then((res) => {
				navigate("/products")
			})
			.catch((err) => console.log("There was a problem", err))
	}
	return (
		<>
			{product && (
				<div className="single-product">
					<h1>{product.title}</h1>
					<p className="price">{product.price}</p>
					<p className="details">{product.description}</p>

					<div className="options">
						<button>
							<Link to={`/form/${product._id}`}>Edit</Link>
						</button>
						<button onClick={(e) => deleteHandler(e)}>Delete</button>
					</div>
				</div>
			)}
		</>
	)
}

export default SingleProduct
