import { useState } from "react";

const PresidentCard = (props) => {
  const { firstName, lastName, age, party } = props;

  const [presAge, setAge] = useState(age);
  console.log(setAge);
  const getOld = () => {
    setAge(presAge + 1);
  };

  return (
    <div>
      <h2>
        {firstName} {lastName}
      </h2>
      <p>Age: {presAge}</p>
      <p>Party: {party}</p>
      <button onClick={getOld}>
        Birthday button for {firstName} {lastName}
      </button>
    </div>
  );
};

export default PresidentCard;
