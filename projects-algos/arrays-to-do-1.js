/* 
 * * * Push Front * * *
* Given an array and an additional value, 
* insert this value at the beginning of the array. 
* You may use .push(), you are able do this without it though!

? Examples:

! pushFront([5,7,2,3], 8) => [8,5,7,2,3]
! pushFront([99], 7) => [7,99]
*/

const pushFront = (arr, val) => {
	const newArray = [val, ...arr]
	return newArray
}

console.log("1. Push Front", pushFront([5, 7, 2, 3], 8))
console.log("2. Push Front", pushFront([99], 7))

/* 
* * * Pop Front * * *
* Given an array, remove and return the 
* value at the beginning of the array. 
* Prove the value is removed from the array 
* by printing it. You may use .pop(), you are 
* able do this without it though!

? Examples:

! popFront([0,5,10,15]) => 0 returned, with [5,10,15] printed in the function
! popFront([4,5,7,9]) => 4 returned, with [5,7,9] printed in the function

*/

const popFront = (arr) => {
	const first = arr.shift()
	console.log("array after shift", arr)
	return first
}

console.log("1. popFront returns:", popFront([0, 5, 10, 15]))
console.log("2. popFront returns:", popFront([4, 5, 7, 9]))
