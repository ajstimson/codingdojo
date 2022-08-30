const { performance } = require("perf_hooks");

Number.prototype.isAPrime = function () {
  for (let i = 2; i < this; i++) {
    if (this % i === 0) {
      return false;
    }
  }
  return true;
};

const start = performance.now();
let primeCount = 0;
let n = 2; // for math reasons, 1 is considered prime
while (primeCount < 1e4) {
  if (n.isAPrime()) {
    primeCount++;
  }
  n++;
}
console.log(`The 10,000th prime number is ${n - 1}`);
console.log(`FOR loop took ${performance.now() - start} milliseconds to run`);
console.log("\n");

const isPrime = (num) => {
  // for (let i = 2; i < this; i++)
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
};

const start2 = performance.now();
let primeCount2 = 0;
let num = 2; // for math reasons, 1 is considered prime
while (primeCount2 < 10000) {
  if (isPrime(num)) {
    primeCount2++;
  }
  num++;
}
console.log(`The 10,000th prime number is ${num - 1}`);
console.log(`This took ${performance.now() - start2} milliseconds to run`);
console.log("\n");

//Just for fun, trying the Lucas Lehmer Test
const lucasLehmerTest = require("lucas-lehmer-test");

const runTest = (numb) => {
  lucasLehmerTest(numb);
};

const start3 = performance.now();
let primeCount3 = 0;
let numb = 2; // for math reasons, 1 is considered prime
while (primeCount3 < 10000) {
  if (isPrime(numb)) {
    primeCount3++;
  }
  numb++;
}
console.log(`The 10,000th prime number is ${numb - 1}`);
console.log(
  `Lucas Lehmer Test took ${performance.now() - start3} milliseconds to run`
);
