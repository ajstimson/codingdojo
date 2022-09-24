const ListItems = (props) => {
	return (
		<li>
			<span>{props.category}: </span>
			<span>{props.data}</span>
		</li>
	)
}

export default ListItems
