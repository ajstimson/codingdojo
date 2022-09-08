import { useState, useEffect } from "react";
import Results from "./Results";

const Form = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [valid, setValid] = useState(false);

  const createUser = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    password === confirm ? setValid(true) : setValid(false);
  }, [password, confirm]);

  return (
    <div>
      <form onSubmit={createUser}>
        <div>
          <label>First Name: </label>
          <input type="text" onChange={(e) => setFirstName(e.target.value)} />
          <label>Last Name: </label>
          <input type="text" onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div>
          <label>Email: </label>
          <input type="text" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Confirm Password: </label>
          <input type="password" onChange={(e) => setConfirm(e.target.value)} />
        </div>
      </form>
      <div className="container">
        <Results
          data={{
            "First Name": firstName,
            "Last Name": lastName,
            Email: email,
            Password: valid ? "Passwords Match!" : "Passwords must match",
          }}
        />
      </div>
    </div>
  );
};

export default Form;
