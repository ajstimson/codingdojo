import "./App.css"
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import Header from "./component/Header"
import Form from "./component/Form"
import ProductList from "./component/ProductList"
import SingleProduct from "./component/SingleProduct"
function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Header />
				<main>
					<Routes>
						<Route
							path="/"
							element={
								<Navigate
									to="/products"
									replace
								/>
							}
						/>
						<Route
							path={"/products"}
							element={<ProductList />}
						/>
						<Route
							path={"/form"}
							element={<Form />}
						/>
						<Route
							path={"/form/:id"}
							element={<Form />}
						/>
						<Route
							path={"/product/:id"}
							element={<SingleProduct />}
						/>
					</Routes>
				</main>
			</BrowserRouter>
		</div>
	)
}

export default App
