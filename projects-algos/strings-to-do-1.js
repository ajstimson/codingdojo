/* 
* * * Remove Blanks * * *
TODO: Create a function that, given a string, returns all of that string’s contents, but without blanks. 

? Examples:

! removeBlanks(" Pl ayTha tF u nkyM usi c ") => "PlayThatFunkyMusic"
! removeBlanks("I can not BELIEVE it's not BUTTER") => "IcannotBELIEVEit'snotBUTTER" 
*/

const removeBlanks = (str) => {
	return str.replace(/\s/g, "")
}

console.log("removeBlanks", removeBlanks(" Pl ayTha tF u nkyM usi c "))
console.log("removeBlanks", removeBlanks("I can not BELIEVE it's not BUTTER"))

/* 
* * * Get Digits * * *
TODO: Create a JavaScript function that given a string, returns the integer made from the string’s digits. You are allowed to use isNaN() and Number().

? Examples:

! getDigits("abc8c0d1ngd0j0!8") => 801008

! getDigits("0s1a3y5w7h9a2t4?6!8?0") => 1357924680

*/

const getDigits = (str) => {
	return str.match(/\d/g).toString().replace(/,/g, "")
}

console.log("getDigits", getDigits("abc8c0d1ngd0j0!8"))
console.log("getDigits", getDigits("0s1a3y5w7h9a2t4?6!8?0"))

/* 
* * * Acronyms * * *
TODO: Create a function that, given a string, returns the string’s acronym (first letter of the word capitalized). You are allowed to use .split() and .toUpperCase().

! acronym(" there's no free lunch - gotta pay yer way. ") => "TNFL-GPYW". 

! acronym("Live from New York, it's Saturday Night!") => "LFNYISN".

 */

const acronym = (str) => {
	let strArray = str.split("")
	const firstLetter = strArray[0].match(/^[A-Za-z]+$/)
		? strArray[0]
		: strArray[1]
	strArray = strArray.filter(
		(l, i) => i > 1 && strArray[i - 1].match(/\s/) && l
	)
	strArray.unshift(firstLetter)
	return strArray.toString().replace(/,/g, "").toUpperCase()
}

console.log("acronym", acronym(" there's no free lunch - gotta pay yer way. "))
console.log("acronym", acronym("Live from New York, it's Saturday Night!"))

/* 
* * * Count Non-Spaces * * *
TODO: Create a function that, given a string, returns the number of non-space characters found in the string. 

? Examples:

! countNonSpaces("Honey pie, you are driving me crazy") => 29

! countNonSpaces("Hello world !") => 11

*/

const countNonSpaces = (str) => {
	return str.replace(/\s/g, "").split("").length
}

console.log(
	"countNonSpaces",
	countNonSpaces("Honey pie, you are driving me crazy")
)

console.log("countNonSpaces", countNonSpaces("Hello world !"))

/* 
* * * Remove Shorter Strings * * *
TODO: Create a function that, given an array of strings and a numerical value, returns an array that only contains strings longer than or equal to the given value.

? Examples:

! removeShorterStrings(['Good morning', 'sunshine', 'the', 'Earth', 'says', 'hello'], 4) => ['Good morning', 'sunshine', 'Earth', 'says', 'hello']
! removeShorterStrings(['There', 'is', 'a', 'bug', 'in', 'the', 'system'], 3) => ['There', 'bug', 'the', 'system'] 
*/

const removeShorterStrings = (arr, num) => {
	return arr.filter((word) => word.length >= num)
}

console.log(
	"removeShorterStrings",
	removeShorterStrings(
		["Good morning", "sunshine", "the", "Earth", "says", "hello"],
		4
	)
)
console.log(
	"removeShorterStrings",
	removeShorterStrings(["There", "is", "a", "bug", "in", "the", "system"], 3)
)
