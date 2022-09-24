import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Form from "./components/Form"
import Display from "./components/Display"
function App() {
	const API = "https://swapi.dev/api/"

	return (
		<BrowserRouter>
			<div className="App">
				<h1>Luke APIwalker</h1>
				<Form api={API} />
				<Routes>
					<Route
						path={"/:category/:id"}
						element={<Display api={API} />}
					/>
				</Routes>
			</div>
		</BrowserRouter>
	)
}

export default App
