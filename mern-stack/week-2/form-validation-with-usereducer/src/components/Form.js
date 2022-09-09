import { useReducer } from "react";
import { TLDs } from "global-tld-list";

const ACTIONS = {
  UPDATE_NAME: "update-name",
  UPDATE_EMAIL: "update-email",
};

const initialState = {
  firstName: {
    value: "",
    error: null,
  },
  lastName: {
    value: "",
    error: null,
  },
  email: {
    value: "",
    error: null,
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_NAME:
      return {
        ...state,
        [action.payload[0]]: {
          value: action.payload[1],
          error: validateName(action.payload[0], action.payload[1]),
        },
      };
    case ACTIONS.UPDATE_EMAIL:
      return {
        ...state,
        email: {
          value: action.payload,
          error: validateEmail(action.payload),
        },
      };
    default:
      return state;
  }
};

const validateName = (name, value) => {
  name = name.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  if (value.length < 3) {
    return `${name} must be at least 3 characters`;
  }
  return null;
};

const validateEmail = (value) => {
  if (!value.includes("@")) {
    return "Email must include @";
  }

  let validTLD = false;
  //only check value after last period (ignore subdomains)
  const tld = value.substring(value.lastIndexOf(".") + 1);

  console.log(tld);
  validTLD = TLDs.includes(tld);

  return !validTLD ? "Email must include a valid domain" : null;
};

const Form = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleNameChange = (e) => {
    dispatch({
      type: ACTIONS.UPDATE_NAME,
      payload: [e.target.name, e.target.value],
    });
  };

  const handleEmailChange = (e) => {
    dispatch({
      type: ACTIONS.UPDATE_EMAIL,
      payload: e.target.value,
    });
  };

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault}>
        <div>
          <div>
            <label>First Name: </label>
            <input
              type="text"
              name="firstName"
              onChange={(e) => handleNameChange(e)}
            />
            {state.firstName.error && (
              <p className="error">{state.firstName.error}</p>
            )}
          </div>
          <div>
            <label>Last Name: </label>
            <input
              type="text"
              name="lastName"
              onChange={(e) => handleNameChange(e)}
            />
            {state.lastName.error && (
              <p className="error">{state.lastName.error}</p>
            )}
          </div>
        </div>
        <div>
          <label>Email: </label>
          <input
            type="text"
            name="email"
            onChange={(e) => handleEmailChange(e)}
          />
          {state.email.error && <p className="error">{state.email.error}</p>}
        </div>
      </form>
    </div>
  );
};

export default Form;
