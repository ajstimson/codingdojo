const Boxes = (props) => {
  console.log(props.data);
  return (
    <div className="boxes">
      {props.data &&
        props.data.map((box, i) => (
          <div
            key={i}
            style={{
              width: box.width + "px",
              height: box.height + "px",
              backgroundColor: box.color,
            }}
          ></div>
        ))}
    </div>
  );
};

export default Boxes;
