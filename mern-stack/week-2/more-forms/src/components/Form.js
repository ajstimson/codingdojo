import { useState, useEffect } from "react";

const Form = () => {
  const [firstName, setFirstName] = useState("");
  const [firstLength, setFirstLength] = useState("");

  const [lastName, setLastName] = useState("");
  const [lastLength, setLastLength] = useState("");

  const [email, setEmail] = useState("");
  const [emailLength, setEmailLength] = useState("");

  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState("");

  const [confirm, setConfirm] = useState("");
  const [valid, setValid] = useState(false);

  const handleInput = (val, min, length, state) => {
    length(val.length);
    val.length > min ? state(val) : state("");
  };

  const createUser = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    setPasswordLength(password.length);
    password === confirm && password.length > 8
      ? setValid(true)
      : setValid(false);
  }, [password, confirm]);

  return (
    <div>
      <form onSubmit={createUser}>
        <div>
          <div>
            <label>First Name: </label>
            <input
              onChange={(e) =>
                handleInput(e.target.value, 2, setFirstLength, setFirstName)
              }
            />
            {firstLength > 0 && (
              <p className="error">First name must be more than 2 characters</p>
            )}
          </div>
          <div>
            <label>Last Name: </label>
            <input
              type="text"
              onChange={(e) =>
                handleInput(e.target.value, 2, setLastLength, setLastName)
              }
            />
            {lastLength > 0 && (
              <p className="error">Last name must be more than 2 characters</p>
            )}
          </div>
        </div>
        <div>
          <label>Email: </label>
          <input
            type="text"
            onChange={(e) =>
              handleInput(e.target.value, 5, setEmailLength, setEmail)
            }
          />
          {emailLength > 0 && (
            <p className="error">Email must be more than 5 characters</p>
          )}
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordLength < 8 && (
            <p className="error">Password must be more than 8 characters</p>
          )}
        </div>
        <div>
          <label>Confirm Password: </label>
          <input type="password" onChange={(e) => setConfirm(e.target.value)} />
          {password !== confirm && (
            <p className="error">Password does not match!</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Form;
