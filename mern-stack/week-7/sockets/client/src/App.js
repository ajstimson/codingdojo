import { useState, useEffect } from "react"
import io from "socket.io-client"
import "./App.css"

function App() {
	const [socket] = useState(() => io(":8000"))

	useEffect(() => {
		// we need to set up all of our event listener
		console.log("Is this running?")
		socket.on("Welcome", (data) => console.log(data))

		// note that we're returning a callback function
		// this ensures that the underlying socket will be closed if App is unmounted
		// this would be more critical if we were creating the socket in a subcomponent
		return () => socket.disconnect(true)
	}, [socket])
	return (
		<div className="App">
			<h1>Socket Test</h1>
		</div>
	)
}

export default App
