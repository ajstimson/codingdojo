import "./App.css";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Main from "./components/Main";
import SubContents from "./components/SubContents";
import Advertisement from "./components/Advertisements";
import Wrapper from "./components/Wrapper";

function App() {
  return (
    <div className="app">
      <Header />
      <Wrapper>
        <Navigation />
        <Main>
          <Wrapper>
            <SubContents prop={1} />
            <SubContents prop={2} />
            <SubContents prop={3} />
          </Wrapper>
          <Advertisement />
        </Main>
      </Wrapper>
    </div>
  );
}

export default App;
