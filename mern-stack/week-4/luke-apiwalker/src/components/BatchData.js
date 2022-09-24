import { useState, useEffect } from "react"
import axios from "axios"

const BatchData = (props) => {
	const { lookUp, category } = props
	const [lookUpInfo, setLookUpInfo] = useState([])
	useEffect(() => {
		setLookUpInfo([])
		const getData = async () => {
			await Promise.all(
				lookUp.map((url) =>
					axios
						.get(url)
						.then((res) => {
							setLookUpInfo((lookUpInfo) => [
								...lookUpInfo,
								category !== "Films" ? res.data.name : res.data.title,
							])
						})
						.catch((error) => {
							console.log(error.toJSON())
						})
				)
			)
		}

		getData()
	}, [lookUp, category])

	return (
		<li className="batch-data">
			<span>{`${category}:`}</span>
			<span>{`${lookUpInfo
				.map((info, i) => (i < lookUpInfo.length - 1 ? `${info}, ` : `${info}`))
				.join("")}`}</span>
			{lookUpInfo.length < 1 && "Looking..."}
		</li>
	)
}

export default BatchData
