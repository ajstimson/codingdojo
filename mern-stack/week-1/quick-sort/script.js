//First generate an array of numbers with random unique values
const arr = [];
while (arr.length < 10) {
  const num = Math.floor(Math.random() * 100) + 1;
  if (arr.indexOf(num) === -1) arr.push(num);
}

console.log("Array of 10 numbers randomly generated", arr);

const quickSort = (pivotMethod, arr, left = 0, right = arr.length - 1) => {
  if (left >= right) return;

  const pivot =
    pivotMethod === "avg" ? closestAverageValue(arr) : middleMostIndex(arr);
  console.log("pivot", pivot);
  console.log("\n");
  const i = partition(arr, left, right, pivot);
  console.log("index", i);
  console.log("\n");
  quickSort(arr, left, i - 1);
  console.log("arr", arr);
  console.log("\n");
  // quickSort(arr, i, right);
  // return arr;
};

const partition = (arr, left, right, pivot) => {
  while (arr[left] <= pivot) {
    left++;
  }
  while (arr[right] > pivot) {
    right--;
  }
  arr[left] <= arr[right]
    ? (([arr[left], arr[right]] = [arr[right], arr[left]]), left++, right--)
    : null;
  return left;
};

//This method would return the value of the middle-most index
const middleMostIndex = (arr) => {
  return arr[Math.floor((arr.length - 1) * 0.5)];
};

const closestAverageValue = (arr) => {
  const sum = arr.reduce((x, y) => x + y);
  const average = Math.floor(sum / arr.length);
  const closestValue = findClosestValue(arr, average);
  console.log(closestValue);
  return closestValue;
};

const findClosestValue = (array, num) => {
  let i = 0;
  let minDiff = 1000;
  let ans;
  for (i in array) {
    const m = Math.abs(num - array[i]);
    if (m < minDiff) {
      minDiff = m;
      ans = arr[i];
    }
  }
  return ans;
};
console.log(
  "Hoare’s partitioning scheme using closest average value",
  quickSort("avg", arr)
);
