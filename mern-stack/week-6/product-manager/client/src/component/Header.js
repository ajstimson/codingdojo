import { Link } from "react-router-dom"

const Header = (props) => {
	return (
		<nav>
			<ul>
				<li>
					<Link to="/products">Products</Link>
				</li>
				<li>
					<Link to="/form">Add Product</Link>
				</li>
			</ul>
		</nav>
	)
}

export default Header
