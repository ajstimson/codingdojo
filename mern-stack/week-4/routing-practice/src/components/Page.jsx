import { useParams } from "react-router-dom"

const Page = (props) => {
	const { path, color, background } = useParams()
	console.log(background)
	return (
		<div style={background ? { background: background } : null}>
			<h1 style={color ? { color: color } : null}>
				The {!isNaN(path) ? "number" : "word"} is: {path}
			</h1>
		</div>
	)
}

export default Page
