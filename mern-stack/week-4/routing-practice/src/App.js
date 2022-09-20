import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import Page from "./components/Page"

function App() {
	return (
		<BrowserRouter>
			<div className="App">
				<Routes>
					<Route
						path={"/:path"}
						element={<Page />}
					/>
					<Route
						path={"/:path/:color/:background"}
						element={<Page />}
					/>
					<Route
						exact
						path="/"
						element={<Home />}
					/>
				</Routes>
			</div>
		</BrowserRouter>
	)
}

export default App
