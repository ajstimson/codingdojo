import { useState, useEffect } from "react"
import axios from "axios"

const BatchData = (props) => {
	const { lookUp, category } = props
	const [lookUpInfo, setLookUpInfo] = useState([])
	const [uniqueInfo, setUniqueInfo] = useState([])
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

	useEffect(() => {
		setUniqueInfo([...new Set(lookUpInfo)])
	}, [lookUpInfo])

	return (
		<li className="batch-data">
			<span>{`${category}:`}</span>
			<span>{`${uniqueInfo
				.map((info, i) => (i < uniqueInfo.length - 1 ? `${info}, ` : `${info}`))
				.join("")}`}</span>
			{uniqueInfo.length < 1 && "N/A"}
		</li>
	)
}

export default BatchData
