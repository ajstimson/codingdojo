const pizzaOptions = {
  crust: [
    "Chicago",
    "deep dish",
    "Neapolitan",
    "thin",
    "traditional",
    "stuffed",
    "Sicilian",
    "hand tossed",
  ],
  cheese: [
    "cheddar",
    "mozzarella",
    "ricotta",
    "feta",
    "none",
    "gouda",
    "goat",
    "vegan",
    "pecorino-romano",
    "paremesan",
    "provolone",
  ],
  sauce: [
    "marinara",
    "alfredo sauce",
    "pesto",
    "white garlic sauce",
    "buffalo Sauce",
    "spicy red sauce",
    "peanut butter",
  ],
  toppings: [
    "pepperoni",
    "sausage",
    "bacon",
    "basil",
    "chili flakes",
    "anchovies",
    "extra cheese",
    "pineapple",
    "ham",
    "red onions",
    "fresh peppers",
    "pickled peppers",
    "garlic",
    "arugula",
    "mushrooms",
    "spinach",
    "papaya",
    "black olives",
    "jalapeños",
    "tomato",
  ],
};

function pizzaOven(event, ...args) {
  const target = event.target.nextElementSibling;
  let pizza = { ...args };

  target.append("pizza = " + JSON.stringify(pizza[0]));
  console.log(pizza[0]);
}

function randomPizza(event) {
  let pizza = {};
  pizza.crust = pizzaOptions.crust[randomNumber(pizzaOptions.crust.length)];
  pizza.sauce = pizzaOptions.sauce[randomNumber(pizzaOptions.sauce.length)];
  pizza.cheese = randomItems(pizzaOptions.cheese, 4);
  pizza.toppings = randomItems(pizzaOptions.toppings, 6);

  const target = event.target.nextElementSibling;
  target.append("pizza = " + JSON.stringify(pizza));
  console.log(pizza);
}

function randomNumber(ceiling) {
  const min = Math.ceil(0);
  const max = Math.floor(ceiling);
  return Math.floor(Math.random() * (max - min) + min);
}

function randomItems(arr, max) {
  let numItems = randomNumber(max);
  let items = [];
  while (numItems > -1) {
    const item = arr[randomNumber(arr.length)];

    items.includes(item) || items.includes("none") ? items : items.push(item);

    numItems--;
  }

  return items;
}
