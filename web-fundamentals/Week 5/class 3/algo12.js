/*  
    12. Shift Array Values
        shiftArrayValsLeft(arr)
        Given an array, move all values forward (to the left) by one index, dropping the first value and leaving a 0 (zero) value at the end of the array.

*/

var array = [1, 2, 3, 4, 5];
//expected result
// [2,3,4,5,0]

function shiftArrayValues(arr) {
  for (let i = 1; i < arr.length; i++) {
    arr[i - 1] = arr[i];
  }
  arr[arr.length - 1] = 0;
  return arr;
}

console.log(shiftArrayValues(array));
