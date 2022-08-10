function hungryArrays() {
  alwaysHungry([3.14, "food", "pie", true, "food"]);
  alwaysHungry([4, 1, 5, 7, 2]);
}

function alwaysHungry(arr) {
  let output = "";

  for (let i = 0; i < arr.length; i++) {
    arr[i] === "food"
      ? (output += "yummy")
      : output && output.match("yummy") && i !== arr.length
      ? (output += " ")
      : null;
  }

  const result = !output ? "I'm hungry" : output;

  appendCode("#a", result);
}

function highPass(arr, cutoff) {
  const result = arr.map((x) => (x > cutoff ? x : undefined)).filter(Number);
  appendCode("#b", result);
}

function betterThanAverage(arr) {
  const average = arr.reduce((a, b) => a + b, 0) / arr.length;

  const result = arr.map((x) => (x > average ? x : "")).filter(Number).length;

  appendCode("#c", result);
}

function arrayReverse(arr, reverse = []) {
  const last = arr[arr.length - 1];

  arr.length > 0
    ? (reverse.push(last), arr.pop(), arrayReverse(arr, reverse))
    : appendCode("#d", reverse);
}

function fibonacciArray(limit, arr = [0, 1], i = 0) {
  const num = arr[arr.length - 2] + arr[arr.length - 1];
  arr.push(num);
  arr.length < limit ? fibonacciArray(limit, arr) : appendCode("#e", arr);
}

function appendCode(target, result) {
  console.log(result);
  target = document.querySelector(target).querySelector(".result");
  const code = document.createElement("code");
  code.setAttribute("class", "result");
  code.append(result);
  target.append(code);
}
