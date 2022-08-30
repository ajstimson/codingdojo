const { performance } = require("perf_hooks");

const story =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident culpa nihil repellat nulla laboriosam maxime, quia aliquam ipsam reprehenderit delectus reiciendis molestias assumenda aut fugit tempore laudantium tempora aspernatur? Repellendus consequatur expedita doloribus soluta cupiditate quae fugit! Aliquid, repellat animi, illum molestias maiores, laboriosam vero impedit iusto mollitia optio labore asperiores!";
const reversed1 = story.split("").reverse().join("");

const start = performance.now();
console.log(reversed1);
console.log("\n");
console.log(
  `split/reverse/join methods took ${
    performance.now() - start
  } milliseconds to run`
);
console.log("\n");

const reversed4 = (str) => {
  let reverse = "";
  for (const current of str) {
    reverse = current + reverse;
  }
  return reverse;
};

const start4 = performance.now();
console.log(reversed4(story));
console.log("\n");
console.log(`For Loop took ${performance.now() - start4} milliseconds to run`);
console.log("\n");

const reversed2 = (str) => {
  return str ? reversed2(str.substr(1)) + str[0] : str;
};

const start2 = performance.now();
console.log(reversed2(story));
console.log("\n");
console.log(`Recursion took ${performance.now() - start2} milliseconds to run`);
console.log("\n");

const reversed3 = (str) => {
  return str
    .split("")
    .reduce((accumulator, current) => current + accumulator, "");
};

const start3 = performance.now();
console.log(reversed3(story));
console.log("\n");
console.log(`Reduce took ${performance.now() - start3} milliseconds to run`);
