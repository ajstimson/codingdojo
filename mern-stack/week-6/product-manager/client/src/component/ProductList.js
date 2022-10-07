import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

const ProductList = () => {
	const [products, setProducts] = useState([])

	useEffect(() => {
		axios
			.get("http://localhost:8000/api/products/all")
			.then((res) => {
				setProducts(res.data.products)
			})
			.catch((err) => console.log("There was a problem", err))
	}, [])

	console.log(products)
	return (
		<>
			<h1>Products</h1>
			{products ? (
				<ul className="product-list">
					{products.map((item, i) => (
						<ul key={i}>
							<li>
								<Link to={"/product/" + item._id}>{item.title}</Link>
							</li>
						</ul>
					))}
				</ul>
			) : (
				<h2>No products found</h2>
			)}
		</>
	)
}

export default ProductList
