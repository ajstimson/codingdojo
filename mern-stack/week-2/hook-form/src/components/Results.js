const Results = (props) => {
  const items = Object.entries(props.data);
  console.log(items);
  return (
    <ul>
      {items.map(([name, value]) => (
        <li key={name}>
          {name}: {value}
        </li>
      ))}
    </ul>
  );
};

export default Results;
