function printOdd() {
  console.log("1. Print odds 1-20");
  let i = 0;
  while (i < 20) {
    i % 2 === 1 ? console.log(i) : null;
    i++;
  }
}

printOdd();

function diminishingThrees() {
  console.log("2. Decreasing Multiples of 3");
  let i = 100;
  while (i > 0) {
    i % 3 === 0 ? console.log(i) : null;
    i--;
  }
}

diminishingThrees();

function printTheSequence() {
  console.log("3. Print the Sequence = 4, 2.5, 1, -0.5, -2, -3.5");
  for (var i = 4; i > -4; i -= 1.5) {
    console.log(i);
  }
}

printTheSequence();

function sigma() {
  console.log("4. Sum all of the values from 1-100");

  let i = 100;
  let x = 0;
  while (i > 0) {
    x = x + i;
    i--;
  }
  console.log(x);
}

sigma();

function factorial() {
  console.log("5. Multiply all of the values from 1-12");
  let x = 1;
  for (var i = 1; i < 13; i++) {
    x = x * i;
  }
  console.log(x);
}

factorial();
