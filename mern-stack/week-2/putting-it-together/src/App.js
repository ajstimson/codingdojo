import "./App.css";
import PresidentCard from "./components/PresidentCard";
import presidents from "./presidents";
import { useState } from "react";

function App() {
  return (
    <div className="App">
      <h1>Presidents</h1>
      {presidents.map((president, i) => {
        return (
          <PresidentCard
            firstName={president.firstName}
            lastName={president.lastName}
            age={president.age}
            party={president.party}
            key={i}
          />
        );
      })}
    </div>
  );
}

export default App;
