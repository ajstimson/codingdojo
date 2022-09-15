import "./App.css";
import Todos from "./components/Todos";

function App() {
  return (
    <div className="App">
      <h1>From the desk of the Right Honorable Pres. Chester A. Arthur</h1>
      <div className="row">
        <div className="column pres">
          <div className="outer-border">
            <div className="mid-border">
              <div className="inner-border">
                <div className="portrait">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Chester_Alan_Arthur.jpg/200px-Chester_Alan_Arthur.jpg"
                    alt="Portrait of Chester A. Arthur"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Todos />
      </div>
    </div>
  );
}

export default App;
