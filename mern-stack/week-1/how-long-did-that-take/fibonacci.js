const { performance } = require("perf_hooks");

// !recursive
function rFib(n) {
  if (n < 2) {
    return n;
  }
  return rFib(n - 1) + rFib(n - 2);
}
const start1 = performance.now();
console.log("recursive", rFib(20));
console.log(`recursive took ${performance.now() - start1} milliseconds to run`);

// !iterative
function iFib(n) {
  const vals = [0, 1];
  while (vals.length - 1 < n) {
    let len = vals.length;
    vals.push(vals[len - 1] + vals[len - 2]);
  }
  return vals[n];
}

const start2 = performance.now();
console.log("iterative", iFib(20));
console.log(`iterative took ${performance.now() - start2} milliseconds to run`);
