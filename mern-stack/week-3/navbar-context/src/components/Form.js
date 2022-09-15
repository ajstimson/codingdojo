import FancyBorder from "./FancyBorder";
import { useContext, useState } from "react";
import { UserContext } from "./UserName";

const Form = () => {
  const user = useContext(UserContext);
  const [inputEntry, setInputEntry] = useState("");

  const handleInput = (e) => {
    setInputEntry(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    user.setUserName(inputEntry);
  };
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <FancyBorder>
        <input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => handleInput(e)}
        />
      </FancyBorder>
    </form>
  );
};
export default Form;
