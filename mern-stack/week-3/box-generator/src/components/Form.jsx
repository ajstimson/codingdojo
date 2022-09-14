import { useState } from "react";
import Boxes from "./Boxes";
import cssColors from "../data/colors";

export default function Form(props) {
  const [inputs, setInputs] = useState(true);

  const [color, setColor] = useState("");
  const [boxArr, setBoxArr] = useState([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const addColor = (e) => {
    const color = e.target.value;
    setColor(color);
  };

  const updateColor = (e) => {
    e.preventDefault();
    !validateColor() ? alert("Please enter a color") : updateBoxes();

    //Clear the input field
    setColor("");
    setHeight(0);
    setWidth(0);
  };

  const updateBoxes = () => {
    setBoxArr([...boxArr, { color, width, height }]);
  };

  const validateColor = () => {
    //Check array of CSS named colors for a match (case insensitive)
    const validColors = cssColors.findIndex((c) => {
      return c.toLowerCase() === color.toLowerCase();
    });

    return validColors < 0 ? false : true;
  };

  const changeDimensions = (e, state) => {
    state(e.target.value > -1 ? e.target.value : 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //love this line of code!
    setInputs(!inputs);
    setHeight(0);
    setWidth(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      {inputs && (
        <div className="col">
          <div className="row">
            <label>
              <span>Color</span>
              <input type="text" value={color} onChange={addColor} />
              <button className="Add" onClick={updateColor}>
                Add
              </button>
            </label>
          </div>
          <div className="row">
            <label>
              <span>Dimensions</span>
              <input
                type="text"
                placeholder="width"
                value={width ? width : ""}
                onChange={(event) => changeDimensions(event, setWidth)}
              />{" "}
              x
              <input
                type="text"
                placeholder="height"
                value={height ? height : ""}
                onChange={(event) => changeDimensions(event, setHeight)}
              />
              px
            </label>
          </div>
        </div>
      )}
      <Boxes data={boxArr} />
      <button type="submit">Submit</button>
    </form>
  );
}
