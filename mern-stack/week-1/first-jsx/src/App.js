import "./App.css";

const todoList = [
  "Learn React",
  "Raise goats",
  "Harvest Tomatoes",
  "Call a friend",
];

const listItems = todoList.map((item) => <li>{item}</li>);

function App() {
  return (
    <div className="App">
      <h1>Hello Dojo!</h1>
      <h2>Things I need to do:</h2>
      <ul>{listItems}</ul>
    </div>
  );
}

export default App;
