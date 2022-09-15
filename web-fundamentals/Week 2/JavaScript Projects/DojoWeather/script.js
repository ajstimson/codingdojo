const conditions = [
  {
    city: "Burbank",
    days: [
      { high: 24, low: 18, desc: "some rain" },
      { high: 27, low: 19, desc: "some sun" },
      { high: 21, low: 16, desc: "some clouds" },
      { high: 26, low: 21, desc: "some sun" },
    ],
  },
  {
    city: "Chicago",
    days: [
      { high: 27, low: 19, desc: "some clouds" },
      { high: 23, low: 17, desc: "some sun" },
      { high: 26, low: 20, desc: "some rain" },
      { high: 24, low: 20, desc: "some rain" },
    ],
  },
  {
    city: "Dallas",
    days: [
      { high: 39, low: 27, desc: "some clouds" },
      { high: 35, low: 26, desc: "some clouds" },
      { high: 37, low: 25, desc: "some clouds" },
      { high: 39, low: 24, desc: "some clouds" },
    ],
  },
];

const cities = document.querySelectorAll("nav .options a");

for (city of cities) {
  city.addEventListener("click", function (e) {
    const city = e.target.id;
    let i = 0;
    for (const condition of conditions) {
      city === condition.city
        ? (alert("Loading " + city + " weather report"), updateReport(i))
        : null;
      i++;
    }
  });
}

function updateReport(cityIndex) {
  const days = document.querySelectorAll(".days .card");
  const cond = conditions[cityIndex];
  const unit = document.getElementById("unit").value;

  for (let i = 0; i < days.length; i++) {
    const day = cond.days[i];
    const img = days[i].querySelector("img");
    const desc = days[i].querySelector(".description");
    const high = days[i].querySelector(".high span");
    const low = days[i].querySelector(".low span");

    day.desc === "some sun"
      ? (img.src = "/assets/some_sun.png")
      : day.desc === "some clouds"
      ? (img.src = "/assets/some_clouds.png")
      : day.desc === "some rain"
      ? (img.src = "/assets/some_rain.png")
      : null;

    desc.innerHTML = day.desc;
    high.innerHTML =
      unit === "f" ? unitConversion(unit, parseInt(day.high)) : day.high;
    low.innerHTML =
      unit === "f" ? unitConversion(unit, parseInt(day.low)) : day.low;
  }
}

const units = document.getElementById("unit");

units.addEventListener("click", function (e) {
  const unit = e.target.value;
  convertUnits(unit);
});

function convertUnits(selectedUnit) {
  const targets = document.querySelectorAll(".temps span");

  for (const target of targets) {
    const unit = target.dataset.unit;
    const temp = parseInt(target.innerHTML);
    const newValue = unitConversion(selectedUnit, temp);

    //toggle data unit between F and C
    target.dataset.unit = selectedUnit;

    //replace temp value if old unit and new don't match
    selectedUnit !== unit ? (target.innerHTML = newValue) : null;
  }
}

function unitConversion(unit, temp) {
  const conversion = unit === "f" ? (temp * 9) / 5 + 32 : ((temp - 32) * 5) / 9;
  return Math.round(conversion);
}

function removeThyself(e) {
  e.target.parentNode.parentNode.remove();
}
