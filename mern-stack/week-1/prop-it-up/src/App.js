import "./index.css";
import PersonCard from "./components/PersonCard";

function App() {
  return (
    <div className="App">
      <PersonCard
        firstName={"William Henry"}
        lastName={"Harrison"}
        age={249}
        hairColor={"Whig"}
      />
      <PersonCard
        firstName={"John"}
        lastName={"Tyler"}
        age={232}
        hairColor={"Brown"}
      />
      <PersonCard
        firstName={"James K."}
        lastName={"Polk"}
        age={227}
        hairColor={"Brown"}
      />
      <PersonCard
        firstName={"Zachary"}
        lastName={"Taylor"}
        age={236}
        hairColor={"Unknown"}
      />
    </div>
  );
}

export default App;
