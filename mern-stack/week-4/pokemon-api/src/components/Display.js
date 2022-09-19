const Display = (props) => {
	const { pokemon } = props
	return (
		<ul>
			{pokemon.data &&
				pokemon.data.map((pokemon, i) => {
					return (
						<li key={i}>
							<p>{pokemon.name}</p>
						</li>
					)
				})}
		</ul>
	)
}

export default Display
