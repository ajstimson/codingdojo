import "./App.css"
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom"
import Form from "./components/Form"
import Display from "./components/Display"
function App() {
	const API = "https://swapi.dev/api/"

	const pathArr = window.location.pathname.split("/", 3)
	return (
		<BrowserRouter>
			<div className="App">
				<h1>Luke APIwalker</h1>
				<Form
					api={API}
					parameters={{ category: pathArr[1], id: pathArr[2] }}
				/>
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
