import { useState } from "react";
import presidents from "../data/presidents";
import numberToWords from "number-to-words";

const Tabs = (props) => {
  //   const [tabs, setTabs] = useState([presidents.map((x) => x.president)]);
  const tabs = presidents.map((x) => x.president);
  const cards = presidents.map((x) => x);

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [activeCard, setActiveCard] = useState(cards[0]);

  const tabSwitch = (e, item) => {
    setActiveTab(tabs[item]);
    setActiveCard(cards[item]);
  };

  return (
    <div className="column tabs">
      <div className="nav">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={activeTab === tab ? "active" : ""}
            onClick={(e) => tabSwitch(e, i)}
          >
            #{numberToWords.toWords(tab)}
          </button>
        ))}
      </div>
      <div className="cards">
        {cards.map((card, i) => (
          <div
            key={i}
            id={numberToWords.toWords(card.president)}
            className={"card row " + (activeCard === card ? "active" : "")}
          >
            <div className="portrait">
              <img
                src={`https://www.whitehouse.gov/wp-content/uploads/2021/01/${
                  card.president
                }_${card.name
                  .replace(/ /g, "_")
                  .toLowerCase()}.jpg?resize=300,300`}
                alt={card.name}
              />
            </div>
            <div className="data column">
              <h2>{card.name}</h2>
              <p>
                {numberToWords.toOrdinal(card.president)} President of the
                United States
              </p>
              <ul>
                <li>Term: {card.years}</li>
                <li>Party: {card.party}</li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
