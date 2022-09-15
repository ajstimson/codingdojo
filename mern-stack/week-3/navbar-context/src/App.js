import "./App.css";
import Wrapper from "./components/Wrapper";
import FormWrapper from "./components/FormWrapper";
import Navbar from "./components/Navbar";
import UserName from "./components/UserName";

function App() {
  return (
    <div className="App">
      <UserName>
        <Wrapper>
          <Navbar />
          <FormWrapper />
        </Wrapper>
      </UserName>
    </div>
  );
}

export default App;
